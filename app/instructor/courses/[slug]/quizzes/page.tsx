import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ClipboardList, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { AssessmentType } from "@prisma/client";

type Props = { params: Promise<{ slug: string }> };

const ASSESSMENT_TYPE_LABELS: Record<AssessmentType, string> = {
  EXERCISE: "Exercise",
  QUIZ: "Quiz",
  TEST: "Test",
  EXAM: "Exam",
};

export default async function CourseQuizzesPage({ params }: Props) {
  const resolvedParams = await params;
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const course = await prisma.course.findUnique({
    where: { slug: resolvedParams.slug },
    include: { instructor: { select: { id: true } } },
  });

  if (!course) return <div>Course not found</div>;
  if (course.instructor.id !== session.userId) return <div>Forbidden</div>;

  const quizzes = await prisma.quiz.findMany({
    where: { courseId: course.id },
    include: {
      questions: {
        select: { id: true },
      },
      Module: {
        select: { id: true, title: true },
      },
      lesson: {
        select: { id: true, title: true },
      },
    },
    orderBy: { id: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/instructor/courses/${course.slug}/edit`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Course Quizzes</h1>
            <p className="text-muted-foreground mt-2">{course.title}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/instructor/courses/${course.slug}/quizzes/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Quiz
          </Link>
        </Button>
      </header>

      <div className="grid gap-4">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <Card key={quiz.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">{quiz.title}</h3>
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                      {ASSESSMENT_TYPE_LABELS[quiz.type]}
                    </span>
                    {quiz.lesson && (
                      <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                        {quiz.lesson.title}
                      </span>
                    )}
                    {quiz.Module && !quiz.lesson && (
                      <span className="text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">
                        {quiz.Module.title}
                      </span>
                    )}
                    {!quiz.Module && !quiz.lesson && (
                      <span className="text-xs font-medium bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                        Course Level
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""} • Passing score: {quiz.passingScore}%
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/instructor/quizzes/${quiz.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-dashed bg-muted/5">
            <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quizzes yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create exams, tests, quizzes, and exercises at any level.
            </p>
            <Button className="mt-4" asChild>
              <Link href={`/instructor/courses/${course.slug}/quizzes/new`}>
                Create your first quiz
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
