import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/progress - Mark lesson as complete
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, moduleId, lessonId, isCompleted = true } = body;
    
    console.log('[Progress API] Request:', { userId: user.id, courseId, moduleId, lessonId, isCompleted });

    if (!courseId || !moduleId) {
      console.log('[Progress API] Missing required fields:', { courseId, moduleId });
      return NextResponse.json(
        { error: 'Course ID and Module ID are required' },
        { status: 400 }
      );
    }

    // Upsert progress record
    const progressId = await getProgressId(user.id, courseId, moduleId, lessonId);
    console.log('[Progress API] Existing progressId:', progressId);
    let progress;
    if (progressId) {
      // Update existing
      console.log('[Progress API] Updating existing progress');
      progress = await prisma.courseProgress.update({
        where: { id: progressId },
        data: {
          isCompleted: isCompleted,
        },
      });
    } else {
      // Create new
      console.log('[Progress API] Creating new progress');
      progress = await prisma.courseProgress.create({
        data: {
          userId: user.id,
          courseId: courseId,
          moduleId: moduleId,
          lessonId: lessonId || null,
          isCompleted: isCompleted,
        },
      });
    }

    console.log('[Progress API] Success:', progress.id);
    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    console.error('[Progress API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

// Helper to find or generate progress ID
async function getProgressId(
  userId: string,
  courseId: string,
  moduleId: string,
  lessonId: string | null
) {
  const existing = await prisma.courseProgress.findFirst({
    where: {
      userId,
      courseId,
      moduleId,
      lessonId: lessonId || null,
    },
    select: { id: true },
  });
  return existing?.id || undefined;
}

// GET /api/progress?courseId=xxx - Get user's progress for a course
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseId = request.nextUrl.searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const progress = await prisma.courseProgress.findMany({
      where: {
        userId: user.id,
        courseId: courseId,
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        module: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Fetch progress error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
