import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'

type RouteContext = {
  params: Promise<{
    courseId: string
    moduleId: string
  }>
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { courseId, moduleId } = await context.params

    if (!courseId || !moduleId) {
      return NextResponse.json(
        {
          error: 'Missing courseId or moduleId',
        },
        {
          status: 400,
        }
      )
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    /*
     * Verify course exists
     * and belongs to logged-in instructor.
     */
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        instructorId: true,
      },
    })

    if (!course) {
      return NextResponse.json(
        {
          error: 'Course not found',
        },
        {
          status: 404,
        }
      )
    }

    if (course.instructorId !== session.userId) {
      return NextResponse.json(
        {
          error: 'Forbidden: you do not own this course',
        },
        {
          status: 403,
        }
      )
    }

    /*
     * Verify module exists
     * and belongs to this course.
     */
    const module = await prisma.module.findUnique({
      where: {
        id: moduleId,
      },
      select: {
        id: true,
        courseId: true,
      },
    })

    if (!module) {
      return NextResponse.json(
        {
          error: 'Module not found',
        },
        {
          status: 404,
        }
      )
    }

    if (module.courseId !== courseId) {
      return NextResponse.json(
        {
          error: 'Module does not belong to this course',
        },
        {
          status: 400,
        }
      )
    }

    /*
     * Parse request body.
     */
    let body: {
      title?: string
      content?: unknown
      order?: number
    }

    try {
      body = await request.json()
    } catch (error) {
      console.error('Lesson creation: invalid JSON body', error)

      return NextResponse.json(
        {
          error: 'Invalid JSON request body',
        },
        {
          status: 400,
        }
      )
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          error: 'Invalid request payload',
        },
        {
          status: 400,
        }
      )
    }

    const {
      title,
      content,
      order,
    } = body

    /*
     * Validate lesson title.
     */
    if (
      !title ||
      typeof title !== 'string' ||
      title.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: 'Lesson title is required',
        },
        {
          status: 400,
        }
      )
    }

    const cleanTitle = title.trim()

    /*
     * Generate base slug.
     */
    let slugBase = cleanTitle
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    /*
     * Fallback if the title somehow
     * produces an empty slug.
     */
    if (!slugBase) {
      slugBase = `lesson-${Date.now()}`
    }

    /*
     * IMPORTANT FIX:
     *
     * Lesson.slug is globally unique in your database.
     * Therefore we must check the whole Lesson table,
     * not only the current module.
     */
    let slug = slugBase
    let suffix = 1

    while (
      await prisma.lesson.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
        },
      })
    ) {
      slug = `${slugBase}-${suffix}`
      suffix += 1
    }

    /*
     * Determine lesson order.
     */
    let lessonOrder: number

    if (
      typeof order === 'number' &&
      Number.isFinite(order) &&
      order > 0
    ) {
      lessonOrder = Math.floor(order)
    } else {
      const lastLesson = await prisma.lesson.findFirst({
        where: {
          moduleId,
        },
        orderBy: {
          order: 'desc',
        },
        select: {
          order: true,
        },
      })

      lessonOrder = lastLesson
        ? lastLesson.order + 1
        : 1
    }

    /*
     * Normalize lesson content.
     */
    const normalizedContent =
      content === undefined || content === null
        ? {}
        : content

    /*
     * Create lesson.
     */
    const lesson = await prisma.lesson.create({
      data: {
        title: cleanTitle,
        slug,
        content: normalizedContent as any,
        order: lessonOrder,
        moduleId,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Lesson created successfully',
        lesson,
      },
      {
        status: 201,
      }
    )
  } catch (error: any) {
    console.error('Lesson creation error:', error)

    /*
     * Extra safety in case two requests
     * happen at exactly the same time.
     */
    if (error?.code === 'P2002') {
      return NextResponse.json(
        {
          error:
            'A lesson with the same slug already exists. Please try again or slightly change the title.',
        },
        {
          status: 409,
        }
      )
    }

    const details =
      error instanceof Error
        ? error.message
        : 'Unknown server error'

    return NextResponse.json(
      {
        error: 'Failed to create lesson',
        details:
          process.env.NODE_ENV === 'development'
            ? details
            : undefined,
      },
      {
        status: 500,
      }
    )
  }
}