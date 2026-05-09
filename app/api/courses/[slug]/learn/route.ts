import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/courses/[slug]/learn - Get course data with user's progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get course with full curriculum
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        syllabus: {
          orderBy: {
            // Assuming modules have an order field or use id
            id: 'asc',
          },
          include: {
            lessons: {
              orderBy: {
                order: 'asc',
              },
              include: {
                quizzes: {
                  select: {
                    id: true,
                    title: true,
                    type: true,
                    passingScore: true,
                  },
                },
              },
            },
            Quiz: {
              select: {
                id: true,
                title: true,
                type: true,
                passingScore: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 403 }
      );
    }

    // Get user's progress for this course
    const progress = await prisma.courseProgress.findMany({
      where: {
        userId: user.id,
        courseId: course.id,
        isCompleted: true,
      },
      select: {
        lessonId: true,
        moduleId: true,
      },
    });

    const completedLessons = new Set(progress.map(p => p.lessonId));

    // Calculate overall progress
    const totalLessons = course.syllabus.reduce(
      (sum, module) => sum + module.lessons.length,
      0
    );
    const completedCount = Array.from(completedLessons).filter(Boolean).length;
    const progressPercentage = totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

    // Get quiz submissions for this course
    const quizSubmissions = await prisma.quizSubmission.findMany({
      where: {
        userId: user.id,
        courseId: course.id,
      },
      select: {
        quizId: true,
        score: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group by quiz to get best scores
    const quizScores: Record<string, { bestScore: number; attempts: number }> = {};
    for (const sub of quizSubmissions) {
      if (!quizScores[sub.quizId]) {
        quizScores[sub.quizId] = { bestScore: sub.score, attempts: 0 };
      }
      quizScores[sub.quizId].bestScore = Math.max(
        quizScores[sub.quizId].bestScore,
        sub.score
      );
      quizScores[sub.quizId].attempts++;
    }

    // Check for certificate
    const certificate = await prisma.certificate.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
      },
    });

    // Get course-level exams (EXAM type with no lesson or module)
    const courseExams = await prisma.quiz.findMany({
      where: {
        courseId: course.id,
        type: 'EXAM',
        lessonId: null,
        moduleId: null,
      },
      select: {
        id: true,
        title: true,
        type: true,
        passingScore: true,
      },
    });

    return NextResponse.json({
      course: course,
      enrollment: enrollment,
      progress: {
        completedLessons: Array.from(completedLessons),
        totalLessons: totalLessons,
        completedCount: completedCount,
        percentage: progressPercentage,
      },
      quizScores: quizScores,
      certificate: certificate,
      courseExams: courseExams,
    });
  } catch (error) {
    console.error('Fetch course learn data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course data' },
      { status: 500 }
    );
  }
}
