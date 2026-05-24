import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const params = await context.params;
    const courseId = params.courseId;
    if (!courseId) {
      return NextResponse.json(
        { error: "Missing courseId" },
        { status: 400 }
      );
    }

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.instructorId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bodyText = await request.text();
    let body: unknown;

    try {
      body = bodyText ? JSON.parse(bodyText) : undefined;
    } catch (parseError) {
      console.error("Module creation validation failed: invalid JSON", {
        courseId,
        bodyText,
        error: parseError,
      });
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      console.error("Module creation validation failed: payload not object", {
        courseId,
        bodyText,
      });
      return NextResponse.json(
        { error: "Invalid request payload: expected JSON object" },
        { status: 400 }
      );
    }

    const { title, description } = body as {
      title?: string;
      description?: string;
    };

    if (!title || !description) {
      console.error("Module creation validation failed: missing required fields", {
        courseId,
        body,
      });
      return NextResponse.json(
        {
          error:
            "Missing required fields: title and description are both required",
        },
        { status: 400 }
      );
    }

    const module = await prisma.module.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        courseId,
      },
    });

    return NextResponse.json(
      { message: "Module created successfully", module },
      { status: 201 }
    );
  } catch (error) {
    console.error("Module creation error:", error);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}
