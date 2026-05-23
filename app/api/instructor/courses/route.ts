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
      return NextResponse.json({ error: 'Only instructors can view their courses' }, { status: 403 });
    }

    const courses = await prisma.course.findMany({
      where: { instructorId: session.userId },
      include: {
        category: true,
        instructor: { select: { name: true } },
        tags: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Failed to fetch instructor courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

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
      discount,
      growthPercentage,
      hiringSectors,
      estimatedSalary,
      expectedIncome,
    } = body;

    // Required: title, description, categoryId
    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description or categoryId' },
        { status: 400 }
      );
    }

    // Validate price only if provided
    let parsedPrice: number | undefined = undefined;
    if (price !== undefined && price !== null && String(price).trim() !== '') {
      parsedPrice = Number(price);
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json(
          { error: 'Invalid price' },
          { status: 400 }
        );
      }
    }

    // Validate discount if provided
    let parsedDiscount: number | undefined = undefined;
    if (discount !== undefined && discount !== null && String(discount).trim() !== '') {
      parsedDiscount = Number(discount);
      if (Number.isNaN(parsedDiscount) || parsedDiscount < 0) {
        return NextResponse.json({ error: 'Invalid discount' }, { status: 400 });
      }
    }

    // Normalize growth percentage if provided
    let parsedGrowth: number | undefined = undefined;
    if (growthPercentage !== undefined && growthPercentage !== null && String(growthPercentage).trim() !== '') {
      parsedGrowth = Number(growthPercentage);
      if (Number.isNaN(parsedGrowth)) {
        return NextResponse.json({ error: 'Invalid growthPercentage' }, { status: 400 });
      }
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Selected category does not exist' },
        { status: 400 }
      );
    }

    const slugBase = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = slugBase;
    let suffix = 1;

    while (await prisma.course.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${suffix++}`;
    }

    const normalizedLearningOutcomes = Array.isArray(learningOutcomes)
      ? learningOutcomes.filter((item) => typeof item === 'string' && item.trim() !== '').map((item: string) => item.trim())
      : [];

    const normalizedCareerFields = Array.isArray(careerFields)
      ? careerFields.filter((item) => typeof item === 'string' && item.trim() !== '').map((item: string) => item.trim())
      : [];

    const normalizedOverview = Array.isArray(overview)
      ? overview.filter((item) => typeof item === 'string' && item.trim() !== '').map((item: string) => item.trim())
      : (typeof overview === 'string' && overview.trim() !== '' ? [overview.trim()] : []);

    const normalizedHiringSectors = Array.isArray(hiringSectors)
      ? hiringSectors.filter((item) => typeof item === 'string' && item.trim() !== '').map((item: string) => item.trim())
      : (typeof hiringSectors === 'string' && hiringSectors.trim() !== '' ? [hiringSectors.trim()] : []);

    const data: any = {
      title: title.trim(),
      slug,
      description: description.trim(),
      overview: normalizedOverview,
      thumbnail: thumbnail?.trim() || null,
      categoryId,
      level,
      duration: duration?.trim() || null,
      hasCertificate: Boolean(hasCertificate),
      hasExam: Boolean(hasExam),
      conductingType,
      learningOutcomes: normalizedLearningOutcomes,
      careerFields: normalizedCareerFields,
      instructorId: session.userId,
    };

    if (parsedPrice !== undefined) {
      data.price = parsedPrice;
    }

    if (parsedDiscount !== undefined) {
      data.discount = parsedDiscount;
    }

    if (parsedGrowth !== undefined) {
      data.growthPercentage = parsedGrowth;
    }

    if (normalizedHiringSectors.length > 0) {
      data.hiringSectors = normalizedHiringSectors;
    }

    if (estimatedSalary && String(estimatedSalary).trim() !== '') {
      data.estimatedSalary = String(estimatedSalary).trim();
    }

    if (expectedIncome && String(expectedIncome).trim() !== '') {
      data.expectedIncome = String(expectedIncome).trim();
    }

    const course = await prisma.course.create({ data });

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
