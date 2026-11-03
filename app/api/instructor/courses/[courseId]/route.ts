import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'

type RouteContext = {
  params: Promise<{
    courseId: string
  }>
}

/* =========================================================
   GET ONE COURSE
========================================================= */

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = await context.params

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        category: true,
        tags: true,
        instructor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    if (course.instructorId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      course,
    })
  } catch (error) {
    console.error('Failed to fetch course:', error)

    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

/* =========================================================
   PATCH COURSE
========================================================= */

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = await context.params

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const existingCourse = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        instructorId: true,
      },
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    if (existingCourse.instructorId !== session.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const updateData: Record<string, unknown> = {}

    if (body.title !== undefined) {
      updateData.title = String(body.title).trim()
    }

    if (body.description !== undefined) {
      updateData.description = String(body.description).trim()
    }

    if (body.overview !== undefined) {
      updateData.overview = body.overview
    }

    if (body.thumbnail !== undefined) {
      updateData.thumbnail = body.thumbnail || null
    }

    if (body.categoryId !== undefined) {
      updateData.categoryId = body.categoryId
    }

    if (body.price !== undefined) {
      updateData.price =
        body.price === '' || body.price === null
          ? 0
          : Number(body.price)
    }

    if (body.discount !== undefined) {
      updateData.discount =
        body.discount === '' || body.discount === null
          ? null
          : Number(body.discount)
    }

    if (body.level !== undefined) {
      updateData.level = body.level
    }

    if (body.duration !== undefined) {
      updateData.duration = body.duration || null
    }

    if (body.hasCertificate !== undefined) {
      updateData.hasCertificate = Boolean(body.hasCertificate)
    }

    if (body.hasExam !== undefined) {
      updateData.hasExam = Boolean(body.hasExam)
    }

    if (body.conductingType !== undefined) {
      updateData.conductingType = body.conductingType
    }

    if (body.learningOutcomes !== undefined) {
      updateData.learningOutcomes = body.learningOutcomes
    }

    if (body.careerFields !== undefined) {
      updateData.careerFields = body.careerFields
    }

    if (body.growthPercentage !== undefined) {
      updateData.growthPercentage =
        body.growthPercentage === '' ||
        body.growthPercentage === null
          ? null
          : Number(body.growthPercentage)
    }

    if (body.hiringSectors !== undefined) {
      updateData.hiringSectors = body.hiringSectors
    }

    if (body.estimatedSalary !== undefined) {
      updateData.estimatedSalary =
        body.estimatedSalary || null
    }

    if (body.expectedIncome !== undefined) {
      updateData.expectedIncome =
        body.expectedIncome || null
    }

    if (body.published !== undefined) {
      updateData.published = Boolean(body.published)
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse,
    })
  } catch (error) {
    console.error('Course update error:', error)

    return NextResponse.json(
      {
        error: 'Failed to update course',
        details:
          process.env.NODE_ENV === 'development' &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    )
  }
}

/* =========================================================
   DELETE COURSE
========================================================= */

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { courseId } = await context.params

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        instructorId: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    if (course.instructorId !== session.userId) {
      return NextResponse.json(
        {
          error: 'You are not authorized to delete this course',
        },
        { status: 403 }
      )
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
      deletedCourse: {
        id: course.id,
        title: course.title,
      },
    })
  } catch (error: unknown) {
    console.error('Course deletion error:', error)

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2003'
    ) {
      return NextResponse.json(
        {
          error:
            'This course cannot be deleted because it still has related data such as modules, lessons, enrollments, quizzes, certificates, FAQs, or learner stories.',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to delete course',
        details:
          process.env.NODE_ENV === 'development' &&
          error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    )
  }
}