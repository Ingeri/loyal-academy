import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

interface FAQData {
  question: string;
  answer: string;
}

// GET - List all FAQs for a course
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

    const faqs = await prisma.fAQ.findMany({
      where: { courseId },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ faqs }, { status: 200 });
  } catch (error) {
    console.error("FAQ list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST - Create new FAQ(s)
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
      console.error("FAQ creation validation failed: invalid JSON", {
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
      console.error("FAQ creation validation failed: payload not object", {
        courseId,
        bodyText,
      });
      return NextResponse.json(
        { error: "Invalid request payload: expected JSON object" },
        { status: 400 }
      );
    }

    const { faqs } = body as { faqs?: FAQData[] };

    if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
      console.error("FAQ creation validation failed: missing or empty faqs array", {
        courseId,
        body,
      });
      return NextResponse.json(
        { error: "Missing required field: faqs array is required" },
        { status: 400 }
      );
    }

    // Validate each FAQ
    for (const faq of faqs) {
      if (!faq.question || typeof faq.question !== "string") {
        return NextResponse.json(
          { error: "Each FAQ must have a valid question" },
          { status: 400 }
        );
      }

      if (!faq.answer || typeof faq.answer !== "string") {
        return NextResponse.json(
          { error: "Each FAQ must have a valid answer" },
          { status: 400 }
        );
      }
    }

    // Create FAQs in transaction
    const createdFaqs = await prisma.$transaction(
      faqs.map((faq) =>
        prisma.fAQ.create({
          data: {
            question: faq.question.trim(),
            answer: faq.answer.trim(),
            courseId,
          },
        })
      ),
      { timeout: 30000 }
    );

    return NextResponse.json(
      { message: "FAQs created successfully", faqs: createdFaqs },
      { status: 201 }
    );
  } catch (error) {
    console.error("FAQ creation error:", error);
    return NextResponse.json(
      { error: "Failed to create FAQs" },
      { status: 500 }
    );
  }
}

// PUT - Update existing FAQ
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

    const { id, question, answer } = body as { id?: string; question?: string; answer?: string };

    if (!id) {
      return NextResponse.json(
        { error: "Missing FAQ id" },
        { status: 400 }
      );
    }

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "FAQ must have a valid question" },
        { status: 400 }
      );
    }

    if (!answer || typeof answer !== "string") {
      return NextResponse.json(
        { error: "FAQ must have a valid answer" },
        { status: 400 }
      );
    }

    const updatedFaq = await prisma.fAQ.update({
      where: { id },
      data: {
        question: question.trim(),
        answer: answer.trim(),
      },
    });

    return NextResponse.json(
      { message: "FAQ updated successfully", faq: updatedFaq },
      { status: 200 }
    );
  } catch (error) {
    console.error("FAQ update error:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// DELETE - Delete FAQ
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
        { error: "Missing FAQ id" },
        { status: 400 }
      );
    }

    await prisma.fAQ.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "FAQ deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("FAQ deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
