import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/quizzes/[id]/results - Get user's submissions for a quiz
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await prisma.quizSubmission.findMany({
      where: {
        userId: user.id,
        quizId: quizId,
      },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get quiz details for context
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        passingScore: true,
        type: true,
      },
    });

    return NextResponse.json({
      quiz: quiz,
      submissions: submissions,
      attemptCount: submissions.length,
      bestScore: submissions.length > 0
        ? Math.max(...submissions.map(s => s.score))
        : 0,
    });
  } catch (error) {
    console.error('Fetch quiz results error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
}
