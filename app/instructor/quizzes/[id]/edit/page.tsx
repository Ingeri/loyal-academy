import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import QuizForm from "@/components/instructor/quiz-form";
import { AssessmentType } from "@prisma/client";

type Props = { params: Promise<{ id: string }> };

export default async function EditQuizPage({ params }: Props) {
  const resolvedParams = await params;
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const quiz = await prisma.quiz.findUnique({
    where: { id: resolvedParams.id },
    include: {
      course: {
        select: {
          id: true,
          slug: true,
          instructorId: true,
        },
      },
      questions: {
        include: {
          options: {
            orderBy: { id: "asc" },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  if (!quiz) return <div>Quiz not found</div>;
  if (quiz.course.instructorId !== session.userId) return <div>Forbidden</div>;

  // Determine level based on which fields are set
  let level: "course" | "module" | "lesson" = "course";
  if (quiz.lessonId) {
    level = "lesson";
  } else if (quiz.moduleId) {
    level = "module";
  }

  const initialQuiz = {
    id: quiz.id,
    title: quiz.title,
    type: quiz.type as AssessmentType,
    passingScore: quiz.passingScore,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.options.map((o) => ({
        id: o.id,
        text: o.text,
        isCorrect: o.isCorrect,
      })),
    })),
  };

  return (
    <QuizForm
      courseId={quiz.courseId}
      moduleId={quiz.moduleId || undefined}
      lessonId={quiz.lessonId || undefined}
      courseSlug={quiz.course.slug}
      level={level}
      initialQuiz={initialQuiz}
      isEdit={true}
    />
  );
}
