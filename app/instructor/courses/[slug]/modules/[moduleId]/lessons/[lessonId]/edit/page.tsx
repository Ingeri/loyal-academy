
import { notFound, redirect } from "next/navigation";
import LessonForm from "@/components/instructor/lesson-form";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

type EditLessonPageProps = {
  params: Promise<{
    slug: string;
    moduleId: string;
    lessonId: string;
  }>;
};

export default async function EditLessonPage({
  params,
}: EditLessonPageProps) {
  const { slug, moduleId, lessonId } = await params;

  // 1. Verify that the user is authenticated.
  const session = await getSession();

  if (!session) {
    const returnPath =
      `/instructor/courses/${encodeURIComponent(slug)}` +
      `/modules/${encodeURIComponent(moduleId)}` +
      `/lessons/${encodeURIComponent(lessonId)}/edit`;

    redirect(
      `/auth/login?redirect=${encodeURIComponent(returnPath)}`
    );
  }

  // 2. Retrieve the lesson and its parent course.
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      moduleId,
      module: {
        course: {
          slug,
        },
      },
    },
    select: {
      id: true,
      title: true,
      content: true,
      module: {
        select: {
          courseId: true,
          course: {
            select: {
              id: true,
              slug: true,
              instructorId: true,
            },
          },
        },
      },
    },
  });

  // 3. The lesson genuinely does not exist
  //    under the specified course and module.
  if (!lesson) {
    console.error("[EditLessonPage] Lesson not found", {
      slug,
      moduleId,
      lessonId,
    });

    notFound();
  }

  // 4. Verify instructor ownership.
  const isCourseInstructor =
    lesson.module.course.instructorId === session.userId;

  if (!isCourseInstructor) {
    console.warn(
      "[EditLessonPage] Access denied: instructor mismatch",
      {
        lessonId,
        courseId: lesson.module.courseId,
        sessionUserId: session.userId,
        courseInstructorId:
          lesson.module.course.instructorId,
      }
    );

    // Do not expose the editing form to an unauthorized user.
    redirect("/instructor/courses");
  }

  // 5. Render the existing lesson editing form.
  return (
    <LessonForm
      courseId={lesson.module.courseId}
      moduleId={moduleId}
      courseSlug={slug}
      lesson={{
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
      }}
    />
  );
}
