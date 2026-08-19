import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string; lessonId: string }> }
) {
  const { courseId, moduleId, lessonId } = await params
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      moduleId,
      module: { courseId, course: { instructorId: session.userId } },
    },
    select: { id: true },
  })
  if (!lesson) return NextResponse.json({ error: 'Lesson not found or access denied' }, { status: 404 })

  let body: { title?: unknown; content?: unknown }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  if (!title) return NextResponse.json({ error: 'Lesson title is required' }, { status: 400 })
  if (!body.content || typeof body.content !== 'object') return NextResponse.json({ error: 'Lesson content is required' }, { status: 400 })

  const updatedLesson = await prisma.lesson.update({
    where: { id: lesson.id },
    data: { title, content: body.content as never },
  })
  return NextResponse.json({ message: 'Lesson updated successfully', lesson: updatedLesson })
}
