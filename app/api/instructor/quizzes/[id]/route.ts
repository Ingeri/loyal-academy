import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { AssessmentType } from "@prisma/client";

interface QuestionData {
  id?: string;
  text: string;
  options: {
    id?: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface QuizUpdateData {
  title: string;
  type: AssessmentType;
  passingScore: number;
  questions: QuestionData[];
}

// GET /api/instructor/quizzes/[id] - Get quiz for editing (with correct answers)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        course: {
          select: { instructorId: true, slug: true },
        },
        questions: {
          include: {
            options: true,
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.course.instructorId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      type: quiz.type,
      passingScore: quiz.passingScore,
      courseId: quiz.courseId,
      moduleId: quiz.moduleId,
      lessonId: quiz.lessonId,
      courseSlug: quiz.course.slug,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      })),
    });
  } catch (error) {
    console.error("Quiz fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

// PUT /api/instructor/quizzes/[id] - Update quiz
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        course: {
          select: { instructorId: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.course.instructorId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bodyText = await request.text();
    let body: unknown;

    try {
      body = bodyText ? JSON.parse(bodyText) : undefined;
    } catch (parseError) {
      console.error("Quiz update validation failed: invalid JSON", {
        quizId: id,
        bodyText,
        error: parseError,
      });
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      console.error("Quiz update validation failed: payload not object", {
        quizId: id,
        bodyText,
      });
      return NextResponse.json(
        { error: "Invalid request payload: expected JSON object" },
        { status: 400 }
      );
    }

    const { title, type, passingScore, questions } = body as QuizUpdateData;

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Quiz must have a valid title" },
        { status: 400 }
      );
    }

    if (!type || !Object.values(AssessmentType).includes(type)) {
      return NextResponse.json(
        { error: "Quiz must have a valid type" },
        { status: 400 }
      );
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "Quiz must have at least one question" },
        { status: 400 }
      );
    }

    // Validate questions
    for (const question of questions) {
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

    // Update quiz in transaction
    const updatedQuiz = await prisma.$transaction(async (tx) => {
      // Update quiz metadata
      await tx.quiz.update({
        where: { id },
        data: {
          title: title.trim(),
          type,
          passingScore: passingScore || 70,
        },
      });

      // Get existing question IDs
      const existingQuestions = await tx.question.findMany({
        where: { quizId: id },
        select: { id: true },
      });
      const existingQuestionIds = new Set(existingQuestions.map((q) => q.id));

      // Get existing option IDs for each question
      const existingOptions = await tx.option.findMany({
        where: { questionId: { in: Array.from(existingQuestionIds) } },
        select: { id: true, questionId: true },
      });
      const existingOptionIdsByQuestion = new Map<string, Set<string>>();
      for (const opt of existingOptions) {
        if (!existingOptionIdsByQuestion.has(opt.questionId)) {
          existingOptionIdsByQuestion.set(opt.questionId, new Set());
        }
        existingOptionIdsByQuestion.get(opt.questionId)!.add(opt.id);
      }

      // Track IDs from the request
      const requestQuestionIds = new Set<string>();
      const requestOptionIds = new Set<string>();

      // Process questions
      for (const questionData of questions) {
        if (questionData.id) {
          requestQuestionIds.add(questionData.id);
          
          // Update existing question
          await tx.question.update({
            where: { id: questionData.id },
            data: { text: questionData.text.trim() },
          });

          // Process options for this question
          const existingOptsForQuestion = existingOptionIdsByQuestion.get(questionData.id) || new Set();
          
          for (const optionData of questionData.options) {
            if (optionData.id) {
              requestOptionIds.add(optionData.id);
              
              // Update existing option
              await tx.option.update({
                where: { id: optionData.id },
                data: {
                  text: optionData.text.trim(),
                  isCorrect: optionData.isCorrect,
                },
              });
            } else {
              // Create new option
              await tx.option.create({
                data: {
                  text: optionData.text.trim(),
                  isCorrect: optionData.isCorrect,
                  questionId: questionData.id,
                },
              });
            }
          }

          // Delete options that were not in the request
          const optionsToDelete = Array.from(existingOptsForQuestion).filter(
            (optId) => !requestOptionIds.has(optId)
          );
          if (optionsToDelete.length > 0) {
            await tx.option.deleteMany({
              where: { id: { in: optionsToDelete } },
            });
          }
        } else {
          // Create new question with options
          const newQuestion = await tx.question.create({
            data: {
              text: questionData.text.trim(),
              quizId: id,
              options: {
                create: questionData.options.map((opt) => ({
                  text: opt.text.trim(),
                  isCorrect: opt.isCorrect,
                })),
              },
            },
          });
          requestQuestionIds.add(newQuestion.id);
        }
      }

      // Delete questions that were not in the request
      const questionsToDelete = Array.from(existingQuestionIds).filter(
        (qId) => !requestQuestionIds.has(qId)
      );
      if (questionsToDelete.length > 0) {
        await tx.question.deleteMany({
          where: { id: { in: questionsToDelete } },
        });
      }

      // Fetch and return updated quiz
      return tx.quiz.findUnique({
        where: { id },
        include: {
          questions: {
            include: {
              options: true,
            },
            orderBy: { id: "asc" },
          },
        },
      });
    });

    return NextResponse.json(
      { message: "Quiz updated successfully", quiz: updatedQuiz },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quiz update error:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}

// DELETE /api/instructor/quizzes/[id] - Delete quiz
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        course: {
          select: { instructorId: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.course.instructorId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete quiz (cascade will handle questions and options)
    await prisma.quiz.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quiz deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
