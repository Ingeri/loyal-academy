import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  ClipboardList,
  ArrowLeft,
  Edit,
} from "lucide-react";
import { AssessmentType } from "@prisma/client";

type Props = {
  params: Promise<{
    slug: string;
    moduleId: string;
  }>;
};

const ASSESSMENT_TYPE_LABELS: Record<
  AssessmentType,
  string
> = {
  EXERCISE: "Exercise",
  QUIZ: "Quiz",
  TEST: "Test",
  EXAM: "Exam",
};

export default async function ModuleQuizzesPage({
  params,
}: Props) {
  const { slug, moduleId } = await params;

  // =========================================================
  // AUTHENTICATION
  // =========================================================

  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  // =========================================================
  // GET COURSE
  // =========================================================

  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    include: {
      instructor: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!course) {
    return <div>Course not found</div>;
  }

  // =========================================================
  // VERIFY COURSE OWNERSHIP
  // =========================================================

  if (course.instructor.id !== session.userId) {
    return <div>Forbidden</div>;
  }

  // =========================================================
  // GET MODULE
  // =========================================================

  const module = await prisma.module.findUnique({
    where: {
      id: moduleId,
    },
    select: {
      id: true,
      courseId: true,
      title: true,
    },
  });

  if (!module) {
    return <div>Module not found</div>;
  }

  // =========================================================
  // VERIFY MODULE BELONGS TO COURSE
  // =========================================================

  if (module.courseId !== course.id) {
    return <div>Invalid module</div>;
  }

  // =========================================================
  // GET MODULE-LEVEL QUIZZES
  // =========================================================

  const quizzes = await prisma.quiz.findMany({
    where: {
      courseId: course.id,
      moduleId: module.id,
      lessonId: null,
    },
    include: {
      questions: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link
              href={`/instructor/courses/${course.slug}/modules/${module.id}`}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl font-bold">
              Module Quizzes
            </h1>

            <p className="mt-2 text-muted-foreground">
              {module.title} • {course.title}
            </p>
          </div>
        </div>

        <Button asChild>
          <Link
            href={`/instructor/courses/${course.slug}/modules/${module.id}/quizzes/new`}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Quiz
          </Link>
        </Button>
      </header>

      {/* QUIZ LIST */}

      <div className="grid gap-4">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <Card
              key={quiz.id}
              className="p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* QUIZ INFORMATION */}

                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-primary" />

                    <h3 className="text-lg font-bold">
                      {quiz.title}
                    </h3>

                    <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {
                        ASSESSMENT_TYPE_LABELS[
                          quiz.type
                        ]
                      }
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {quiz.questions.length}{" "}
                    question
                    {quiz.questions.length !== 1
                      ? "s"
                      : ""}{" "}
                    • Passing score:{" "}
                    {quiz.passingScore}%
                  </p>
                </div>

                {/* ACTIONS */}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link
                      href={`/instructor/quizzes/${quiz.id}/edit`}
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          // =================================================
          // EMPTY STATE
          // =================================================

          <Card className="border-dashed bg-muted/5 p-12 text-center">
            <ClipboardList className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <p className="text-muted-foreground">
              No quizzes yet.
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Create quizzes and tests at the
              module level.
            </p>

            <Button
              className="mt-4"
              asChild
            >
              <Link
                href={`/instructor/courses/${course.slug}/modules/${module.id}/quizzes/new`}
              >
                Create your first quiz
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}