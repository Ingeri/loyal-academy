import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

interface LearnerStoryData {
  name: string;
  role?: string;
  story: string;
  image?: string;
}

// GET - List all learner stories for a course
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const params = await context.params;
    const { courseId } = params;

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

    const learnerStories = await prisma.learnerStory.findMany({
      where: { courseId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ learnerStories }, { status: 200 });
  } catch (error) {
    console.error("Learner story list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch learner stories" },
      { status: 500 }
    );
  }
}

// POST - Create new learner story/stories
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const params = await context.params;
    const { courseId } = params;

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
      console.error("Learner story creation validation failed: invalid JSON", {
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
      console.error("Learner story creation validation failed: payload not object", {
        courseId,
        bodyText,
      });
      return NextResponse.json(
        { error: "Invalid request payload: expected JSON object" },
        { status: 400 }
      );
    }

    const { learnerStories } = body as { learnerStories?: LearnerStoryData[] };

    if (!learnerStories || !Array.isArray(learnerStories) || learnerStories.length === 0) {
      console.error("Learner story creation validation failed: missing or empty learnerStories array", {
        courseId,
        body,
      });
      return NextResponse.json(
        { error: "Missing required field: learnerStories array is required" },
        { status: 400 }
      );
    }

    // Validate each learner story
    for (const story of learnerStories) {
      if (!story.name || typeof story.name !== "string") {
        return NextResponse.json(
          { error: "Each learner story must have a valid name" },
          { status: 400 }
        );
      }

      if (!story.story || typeof story.story !== "string") {
        return NextResponse.json(
          { error: "Each learner story must have a valid story" },
          { status: 400 }
        );
      }

      if (story.role && typeof story.role !== "string") {
        return NextResponse.json(
          { error: "Role must be a string if provided" },
          { status: 400 }
        );
      }

      if (story.image && typeof story.image !== "string") {
        return NextResponse.json(
          { error: "Image must be a string URL if provided" },
          { status: 400 }
        );
      }
    }

    // Create learner stories in transaction
    const createdStories = await prisma.$transaction(
      learnerStories.map((story) =>
        prisma.learnerStory.create({
          data: {
            name: story.name.trim(),
            role: story.role?.trim(),
            story: story.story.trim(),
            image: story.image?.trim(),
            courseId,
          },
        })
      ),
      { timeout: 30000 }
    );

    return NextResponse.json(
      { message: "Learner stories created successfully", learnerStories: createdStories },
      { status: 201 }
    );
  } catch (error) {
    console.error("Learner story creation error:", error);
    return NextResponse.json(
      { error: "Failed to create learner stories" },
      { status: 500 }
    );
  }
}

// PUT - Update existing learner story
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const params = await context.params;
    const { courseId } = params;

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
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { id, name, role, story, image } = body as { 
      id?: string; 
      name?: string; 
      role?: string; 
      story?: string; 
      image?: string 
    };

    if (!id) {
      return NextResponse.json(
        { error: "Missing learner story id" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Learner story must have a valid name" },
        { status: 400 }
      );
    }

    if (!story || typeof story !== "string") {
      return NextResponse.json(
        { error: "Learner story must have a valid story" },
        { status: 400 }
      );
    }

    const updatedStory = await prisma.learnerStory.update({
      where: { id },
      data: {
        name: name.trim(),
        role: role?.trim(),
        story: story.trim(),
        image: image?.trim(),
      },
    });

    return NextResponse.json(
      { message: "Learner story updated successfully", learnerStory: updatedStory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Learner story update error:", error);
    return NextResponse.json(
      { error: "Failed to update learner story" },
      { status: 500 }
    );
  }
}

// DELETE - Delete learner story
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const params = await context.params;
    const { courseId } = params;

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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing learner story id" },
        { status: 400 }
      );
    }

    await prisma.learnerStory.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Learner story deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Learner story deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete learner story" },
      { status: 500 }
    );
  }
}
