import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const params = await context.params;
    const { courseId, moduleId } = params;

    if (!courseId || !moduleId) {
      return NextResponse.json(
        { error: "Missing courseId or moduleId" },
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

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      select: { courseId: true },
    });

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    if (module.courseId !== courseId) {
      return NextResponse.json(
        { error: "Module does not belong to this course" },
        { status: 400 }
      );
    }

    const bodyText = await request.text();
    let body: unknown;

    try {
      body = bodyText ? JSON.parse(bodyText) : undefined;
    } catch (parseError) {
      console.error("Lesson creation validation failed: invalid JSON", {
        moduleId,
        bodyText,
        error: parseError,
      });
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      console.error("Lesson creation validation failed: payload not object", {
        moduleId,
        bodyText,
      });
      return NextResponse.json(
        { error: "Invalid request payload: expected JSON object" },
        { status: 400 }
      );
    }

    const { title, content, order } = body as {
      title?: string;
      content?: unknown;
      order?: number;
    };

    if (!title) {
      console.error("Lesson creation validation failed: missing required fields", {
        moduleId,
        body,
      });
      return NextResponse.json(
        { error: "Missing required field: title is required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Get the next order if not provided
    let lessonOrder = order;
    if (lessonOrder === undefined) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { moduleId },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        slug,
        content: content || {},
        order: lessonOrder,
        moduleId,
      },
    });

    return NextResponse.json(
      { message: "Lesson created successfully", lesson },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lesson creation error:", error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
