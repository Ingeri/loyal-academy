import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import QuizForm from "@/components/instructor/quiz-form";

type Props = { params: Promise<{ slug: string; moduleId: string; lessonId: string }> };

export default async function AddQuizPage({ params }: Props) {
  const resolvedParams = await params;
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const course = await prisma.course.findUnique({
    where: { slug: resolvedParams.slug },
    select: {
      id: true,
      title: true,
      slug: true,
      instructor: { select: { id: true } },
    },
  });

  if (!course) return <div>Course not found</div>;
  if (course.instructor.id !== session.userId) return <div>Forbidden</div>;

  const module = await prisma.module.findUnique({
    where: { id: resolvedParams.moduleId },
    select: { courseId: true },
  });

  if (!module) return <div>Module not found</div>;
  if (module.courseId !== course.id) return <div>Invalid module</div>;

  const lesson = await prisma.lesson.findUnique({
    where: { id: resolvedParams.lessonId },
    select: { moduleId: true },
  });

  if (!lesson) return <div>Lesson not found</div>;
  if (lesson.moduleId !== resolvedParams.moduleId) return <div>Invalid lesson</div>;

  return (
    <QuizForm
      courseId={course.id}
      moduleId={resolvedParams.moduleId}
      lessonId={resolvedParams.lessonId}
      courseSlug={course.slug}
      level="lesson"
    />
  );
}
