import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/quizzes/[id] - Get quiz details with questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params;
    console.log('[Quiz API] Fetching quiz:', quizId);

    const user = await getUser();
    console.log('[Quiz API] User:', user?.id || 'none');

    if (!user) {
      console.log('[Quiz API] Unauthorized - no user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get quiz with questions (without revealing correct answers)
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: {
              select: {
                id: true,
                text: true,
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      console.log('[Quiz API] Quiz not found:', quizId);
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    console.log('[Quiz API] Found quiz:', quiz.title, 'Questions:', quiz.questions.length);

    // Get user's previous submissions
    const submissions = await prisma.quizSubmission.findMany({
      where: {
        userId: user.id,
        quizId: quizId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      type: quiz.type,
      passingScore: quiz.passingScore,
      questions: quiz.questions.map(q => ({
        id: q.id,
        text: q.text,
        options: q.options,
      })),
      totalQuestions: quiz.questions.length,
      previousAttempts: submissions.length,
      bestScore: submissions.length > 0 ? Math.max(...submissions.map(s => s.score)) : null,
    });
  } catch (error) {
    console.error('[Quiz API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
