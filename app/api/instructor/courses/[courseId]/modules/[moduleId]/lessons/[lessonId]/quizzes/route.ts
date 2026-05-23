import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { AssessmentType } from "@prisma/client";

interface QuizData {
  title: string;
  type: AssessmentType;
  passingScore: number;
  questions: {
    text: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) {
  try {
    const params = await context.params;
    const { courseId, moduleId, lessonId } = params;

    if (!courseId || !moduleId || !lessonId) {
      return NextResponse.json(
        { error: "Missing courseId, moduleId, or lessonId" },
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

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { moduleId: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    if (lesson.moduleId !== moduleId) {
      return NextResponse.json(
        { error: "Lesson does not belong to this module" },
        { status: 400 }
      );
    }

    const bodyText = await request.text();
    let body: unknown;

    try {
      body = bodyText ? JSON.parse(bodyText) : undefined;
    } catch (parseError) {
      console.error("Quiz creation validation failed: invalid JSON", {
        lessonId,
        bodyText,
        error: parseError,
      });
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      console.error("Quiz creation validation failed: payload not object", {
        lessonId,
        bodyText,
      });
      return NextResponse.json(
        { error: "Invalid request payload: expected JSON object" },
        { status: 400 }
      );
    }

    const { quizzes } = body as { quizzes?: QuizData[] };

    if (!quizzes || !Array.isArray(quizzes) || quizzes.length === 0) {
      console.error("Quiz creation validation failed: missing or empty quizzes array", {
        lessonId,
        body,
      });
      return NextResponse.json(
        { error: "Missing required field: quizzes array is required" },
        { status: 400 }
      );
    }

    // Validate each quiz
    for (const quiz of quizzes) {
      if (!quiz.title || typeof quiz.title !== "string") {
        return NextResponse.json(
          { error: "Each quiz must have a valid title" },
          { status: 400 }
        );
      }

      if (!quiz.type || !Object.values(AssessmentType).includes(quiz.type)) {
        return NextResponse.json(
          { error: "Each quiz must have a valid type" },
          { status: 400 }
        );
      }

      if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
        return NextResponse.json(
          { error: "Each quiz must have at least one question" },
          { status: 400 }
        );
      }

      // Validate questions
      for (const question of quiz.questions) {
        if (!question.text || typeof question.text !== "string") {
          return NextResponse.json(
            { error: "Each question must have valid text" },
            { status: 400 }
          );
        }

        if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
          return NextResponse.json(
            { error: "Each question must have at least 2 options" },
            { status: 400 }
          );
        }

        if (question.options.length > 5) {
          return NextResponse.json(
            { error: "Each question can have at most 5 options" },
            { status: 400 }
          );
        }

        // Validate options and ensure exactly one correct answer
        const correctCount = question.options.filter((opt) => opt.isCorrect).length;
        if (correctCount !== 1) {
          return NextResponse.json(
            { error: "Each question must have exactly one correct answer" },
            { status: 400 }
          );
        }

        for (const option of question.options) {
          if (!option.text || typeof option.text !== "string") {
            return NextResponse.json(
              { error: "Each option must have valid text" },
              { status: 400 }
            );
          }
        }
      }
    }

    // Create quizzes in transaction with increased timeout
    const createdQuizzes = await prisma.$transaction(
      quizzes.map((quiz) =>
        prisma.quiz.create({
          data: {
            title: quiz.title.trim(),
            type: quiz.type,
            passingScore: quiz.passingScore || 70,
            courseId,
            moduleId,
            lessonId,
            questions: {
              create: quiz.questions.map((question) => ({
                text: question.text.trim(),
                options: {
                  create: question.options.map((option) => ({
                    text: option.text.trim(),
                    isCorrect: option.isCorrect,
                  })),
                },
              })),
            },
          },
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        })
      ),
      { timeout: 30000 } // 30 second timeout
    );

    return NextResponse.json(
      { message: "Quizzes created successfully", quizzes: createdQuizzes },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quiz creation error:", error);
    return NextResponse.json(
      { error: "Failed to create quizzes" },
      { status: 500 }
    );
  }
}
