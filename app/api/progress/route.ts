import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/progress - Mark lesson as complete
// POST /api/progress - Mark lesson as complete
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, moduleId, lessonId, isCompleted = true } = body;

    if (!courseId || !moduleId) {
      return NextResponse.json(
        { error: 'Course ID and Module ID are required' },
        { status: 400 }
      );
    }

    // 1. Upsert progress record (Your existing logic)
    const progressId = await getProgressId(user.id, courseId, moduleId, lessonId);
    let progress;
    if (progressId) {
      progress = await prisma.courseProgress.update({
        where: { id: progressId },
        data: { isCompleted: isCompleted },
      });
    } else {
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

    // 🚀 2. CALCULATE AND UPDATE ENROLLMENT TABLE
    // Get total number of lessons in the entire course
    const totalLessonsCount = await prisma.lesson.count({
      where: { module: { courseId: courseId } }
    });

    // Get number of lessons completed by this user for this course
    const completedLessonsCount = await prisma.courseProgress.count({
      where: {
        userId: user.id,
        courseId: courseId,
        isCompleted: true,
        lessonId: { not: null } // Only count actual lessons
      }
    });

    // Calculate the percentage (0 - 100)
    const percentage = totalLessonsCount > 0
      ? (completedLessonsCount / totalLessonsCount) * 100
      : 0;

    // Update the Enrollment table
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId
        }
      },
      data: {
        progress: percentage
      }
    });

    return NextResponse.json({
      ...progress,
      totalCourseProgress: percentage
    }, { status: 200 });

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
