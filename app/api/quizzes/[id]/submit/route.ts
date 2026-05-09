import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/quizzes/[id]/submit - Submit quiz answers
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { answers, courseId } = body; // answers: [{ questionId, optionId }]

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers array is required' },
        { status: 400 }
      );
    }

    // Get quiz with questions and correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Calculate score
    let correctCount = 0;
    const answerRecords = [];

    for (const answer of answers) {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      const selectedOption = question.options.find(o => o.id === answer.optionId);
      if (!selectedOption) continue;

      const isCorrect = selectedOption.isCorrect;
      if (isCorrect) correctCount++;

      answerRecords.push({
        questionId: answer.questionId,
        optionId: answer.optionId,
        isCorrect: isCorrect,
      });
    }

    const totalQuestions = quiz.questions.length;
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const passed = score >= quiz.passingScore;

    // Create submission
    const submission = await prisma.quizSubmission.create({
      data: {
        userId: user.id,
        quizId: quizId,
        courseId: courseId || quiz.courseId || null,
        score: score,
      },
    });

    // Create answers
    await prisma.quizAnswer.createMany({
      data: answerRecords.map(record => ({
        ...record,
        submissionId: submission.id,
      })),
    });

    // Fetch complete submission with answers
    const completeSubmission = await prisma.quizSubmission.findUnique({
      where: { id: submission.id },
      include: {
        answers: {
          include: {
            question: {
              select: {
                id: true,
                text: true,
              },
            },
            option: {
              select: {
                id: true,
                text: true,
                isCorrect: true,
              },
            },
          },
        },
      },
    });

    // Build result with all questions and correct answers
    const resultQuestions = quiz.questions.map(q => {
      const userAnswer = completeSubmission?.answers.find(a => a.questionId === q.id);
      const correctOption = q.options.find(o => o.isCorrect);

      return {
        id: q.id,
        text: q.text,
        options: q.options.map(o => ({
          id: o.id,
          text: o.text,
          isCorrect: o.isCorrect,
        })),
        userSelectedOptionId: userAnswer?.optionId || null,
        isCorrect: userAnswer?.isCorrect || false,
        correctOptionId: correctOption?.id || null,
      };
    });

    return NextResponse.json({
      submission: completeSubmission,
      score: score,
      passed: passed,
      passingScore: quiz.passingScore,
      correctCount: correctCount,
      totalQuestions: totalQuestions,
      questions: resultQuestions,
    }, { status: 201 });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
