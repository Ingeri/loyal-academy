import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is an instructor
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (!user || user.role !== 'INSTRUCTOR') {
      return NextResponse.json(
        { error: 'Only instructors can create courses' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      overview,
      thumbnail,
      categoryId,
      price,
      level,
      duration,
      hasCertificate,
      hasExam,
      conductingType,
      learningOutcomes,
      careerFields,
    } = body;

    // Validate required fields
    if (!title || !description || !categoryId || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: 'A course with this title already exists' },
        { status: 409 }
      );
    }

    // Create the course
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        overview,
        thumbnail,
        categoryId,
        price: parseFloat(price),
        level,
        duration,
        hasCertificate,
        hasExam,
        conductingType,
        learningOutcomes: learningOutcomes || [],
        careerFields: careerFields || [],
      },
    });

    return NextResponse.json({
      message: 'Course created successfully',
      course,
      slug: course.slug,
    });
  } catch (error) {
    console.error('Course creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
