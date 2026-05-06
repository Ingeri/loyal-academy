import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';

// Create a new enrollment
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    console.log('Enrollment POST - User:', user?.id);

    if (!user) {
      console.log('Enrollment POST - No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    console.log('Enrollment POST - CourseId:', courseId);

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Check if course exists in DB
    const courseExists = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true },
    });
    console.log('Enrollment POST - Course exists:', courseExists);

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
          },
        },
      },
    });

    console.log('Enrollment POST - Created enrollment:', enrollment);

    // Verify the enrollment was saved by fetching it back
    const verifyEnrollment = await prisma.enrollment.findUnique({
      where: { id: enrollment.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
          },
        },
      },
    });

    console.log('Enrollment POST - Verified enrollment:', verifyEnrollment);

    return NextResponse.json({
      ...enrollment,
      debug: {
        savedToDatabase: !!verifyEnrollment,
        enrollmentId: enrollment.id,
        userId: user.id,
        courseId: courseId,
        enrolledAt: enrollment.createdAt,
        verified: !!verifyEnrollment,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Enrollment error:', error);
    // Log detailed error info
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to create enrollment', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Get user's enrollments
export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.id,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Fetch enrollments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}
