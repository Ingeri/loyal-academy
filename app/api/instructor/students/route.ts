import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Only instructors can view their students' }, { status: 403 });
    }

    // Get all courses taught by this instructor
    const courses = await prisma.course.findMany({
      where: { instructorId: session.userId },
      select: { id: true, title: true },
    });

    const courseIds = courses.map(c => c.id);

    // Get all enrollments for these courses with student details
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get quiz submissions for these students in these courses
    const quizSubmissions = await prisma.quizSubmission.findMany({
      where: {
        courseId: { in: courseIds },
        userId: { in: enrollments.map(e => e.userId) },
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            passingScore: true,
          },
        },
      },
    });

    // Get certificates for these students in these courses
    const certificates = await prisma.certificate.findMany({
      where: {
        courseId: { in: courseIds },
        userId: { in: enrollments.map(e => e.userId) },
      },
    });

    // Group data by student
    const studentMap = new Map();

    enrollments.forEach(enrollment => {
      const studentId = enrollment.user.id;
      
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          id: enrollment.user.id,
          name: enrollment.user.name || 'Unknown',
          email: enrollment.user.email,
          enrollments: [],
          quizScores: [],
          certificates: [],
        });
      }

      const student = studentMap.get(studentId);
      student.enrollments.push({
        courseId: enrollment.course.id,
        courseTitle: enrollment.course.title,
        progress: enrollment.progress,
        enrolledAt: enrollment.createdAt,
        lastUpdated: enrollment.updatedAt,
      });
    });

    // Add quiz submissions to students
    quizSubmissions.forEach(submission => {
      const studentId = submission.userId;
      if (studentMap.has(studentId)) {
        const student = studentMap.get(studentId);
        student.quizScores.push({
          quizId: submission.quizId,
          quizTitle: submission.quiz.title,
          score: submission.score,
          passingScore: submission.quiz.passingScore,
          submittedAt: submission.createdAt,
          courseId: submission.courseId,
        });
      }
    });

    // Add certificates to students
    certificates.forEach(certificate => {
      const studentId = certificate.userId;
      if (studentMap.has(studentId)) {
        const student = studentMap.get(studentId);
        student.certificates.push({
          courseId: certificate.courseId,
          grade: certificate.grade,
          finalScore: certificate.finalScore,
          issueDate: certificate.issueDate,
          certificateNumber: certificate.certificateNumber,
        });
      }
    });

    const students = Array.from(studentMap.values());

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Failed to fetch instructor students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
