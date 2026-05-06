import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/certificates/generate - Generate certificate if eligible
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Check if already has certificate
    const existingCert = await prisma.certificate.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
      },
    });

    if (existingCert) {
      return NextResponse.json(
        { error: 'Certificate already exists', certificate: existingCert },
        { status: 400 }
      );
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 403 }
      );
    }

    // Get course with all modules and lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        syllabus: {
          include: {
            lessons: true,
          },
        },
        quizzes: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get user's progress
    const progress = await prisma.courseProgress.findMany({
      where: {
        userId: user.id,
        courseId: courseId,
        isCompleted: true,
      },
    });

    const completedLessons = new Set(progress.map(p => p.lessonId).filter(Boolean));
    const totalLessons = course.syllabus.reduce(
      (sum, module) => sum + module.lessons.length,
      0
    );

    // Get final exam score (highest score from exam type quizzes)
    const examQuizzes = course.quizzes.filter(q => q.type === 'EXAM');
    let finalExamScore = 0;

    if (examQuizzes.length > 0) {
      const examSubmissions = await prisma.quizSubmission.findMany({
        where: {
          userId: user.id,
          quizId: {
            in: examQuizzes.map(q => q.id),
          },
        },
        orderBy: {
          score: 'desc',
        },
        take: 1,
      });

      if (examSubmissions.length > 0) {
        finalExamScore = examSubmissions[0].score;
      }
    }

    // Check eligibility: all lessons completed AND final exam passed (>=70%)
    const allLessonsCompleted = completedLessons.size >= totalLessons;
    const passedFinalExam = finalExamScore >= 70 || examQuizzes.length === 0;

    if (!allLessonsCompleted) {
      return NextResponse.json(
        {
          error: 'Not eligible for certificate',
          reason: 'Incomplete lessons',
          completedLessons: completedLessons.size,
          totalLessons: totalLessons,
        },
        { status: 403 }
      );
    }

    if (!passedFinalExam) {
      return NextResponse.json(
        {
          error: 'Not eligible for certificate',
          reason: 'Final exam not passed',
          examScore: finalExamScore,
          requiredScore: 70,
        },
        { status: 403 }
      );
    }

    // Calculate grade
    const finalScore = finalExamScore || 100;
    let grade = 'C';
    if (finalScore >= 90) grade = 'A';
    else if (finalScore >= 80) grade = 'B';

    // Generate certificate number
    const certificateNumber = `LC-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        userId: user.id,
        courseId: courseId,
        certificateNumber: certificateNumber,
        grade: grade,
        finalScore: finalScore,
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Certificate generated successfully',
        certificate: certificate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
