import { notFound, redirect } from 'next/navigation'
import LessonForm from '@/components/instructor/lesson-form'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ slug: string; moduleId: string; lessonId: string }>
}) {
  const { slug, moduleId, lessonId } = await params
  const session = await getSession()
  if (!session) redirect(`/auth/login?redirect=/instructor/courses/${slug}/modules/${moduleId}/lessons/${lessonId}/edit`)

  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      moduleId,
      module: { course: { slug, instructorId: session.userId } },
    },
    select: { id: true, title: true, content: true, module: { select: { courseId: true } } },
  })
  if (!lesson) notFound()

  return (
    <LessonForm
      courseId={lesson.module.courseId}
      moduleId={moduleId}
      courseSlug={slug}
      lesson={{ id: lesson.id, title: lesson.title, content: lesson.content }}
    />
  )
}
