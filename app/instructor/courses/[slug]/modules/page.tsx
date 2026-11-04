import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  BookOpen,
  ClipboardList,
} from "lucide-react";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CoursesModulesPage({
  params,
}: Props) {
  const resolvedParams = await params;

  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  /* =========================================================
     GET COURSE
  ========================================================= */

  const course = await prisma.course.findUnique({
    where: {
      slug: resolvedParams.slug,
    },

    include: {
      instructor: {
        select: {
          id: true,
        },
      },
    },
  });

  /* =========================================================
     COURSE VALIDATION
  ========================================================= */

  if (!course) {
    return <div>Course not found</div>;
  }

  if (course.instructor.id !== session.userId) {
    return <div>Forbidden</div>;
  }

  /* =========================================================
     GET MODULES

     Modules are displayed from first to last.

     order ASC:
     Module 1
     Module 2
     Module 3
     Module 4

     createdAt is used as a secondary ordering rule.
  ========================================================= */

  const modules = await prisma.module.findMany({
    where: {
      courseId: course.id,
    },

    include: {
      _count: {
        select: {
          lessons: true,
        },
      },
    },

    orderBy: [
      {
        order: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Course Modules
          </h1>

          <p className="mt-2 text-muted-foreground">
            {course.title}
          </p>
        </div>

        <Button asChild>
          <Link
            href={`/instructor/courses/${course.slug}/modules/new`}
          >
            <Plus className="mr-2 h-4 w-4" />

            Add Module
          </Link>
        </Button>
      </header>

      {/* =====================================================
          MODULE LIST
      ===================================================== */}

      <div className="grid gap-6">
        {modules.length > 0 ? (
          modules.map((module, index) => (
            <Card
              key={module.id}
              className="p-6 sm:p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                {/* =================================================
                    MODULE INFORMATION
                ================================================= */}

                <div className="min-w-0 flex-1">

                  {/* MODULE NUMBER + TITLE */}

                  <div className="mb-5 flex items-start gap-3">
                    <BookOpen className="mt-1 h-5 w-5 shrink-0 text-primary" />

                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        Module {index + 1}
                      </p>

                      <h3 className="font-serif text-xl font-bold leading-tight text-foreground sm:text-2xl">
                        {module.title}
                      </h3>
                    </div>
                  </div>

                  {/* =================================================
                      MODULE DESCRIPTION

                      This formatting automatically applies to EVERY
                      module created through the rich-text editor.
                  ================================================= */}

                  {module.description && (
                    <div
                      className="
                        mt-6
                        max-w-4xl
                        font-serif
                        text-[17px]
                        leading-[1.6]
                        text-foreground/90

                        [&_p]:mb-5
                        [&_p]:leading-[1.6]
                        [&_p:last-child]:mb-0

                        [&_h1]:mb-6
                        [&_h1]:mt-8
                        [&_h1]:text-3xl
                        [&_h1]:font-bold
                        [&_h1]:leading-tight
                        [&_h1]:text-primary

                        [&_h2]:mb-5
                        [&_h2]:mt-7
                        [&_h2]:text-[22px]
                        [&_h2]:font-bold
                        [&_h2]:leading-tight
                        [&_h2]:text-foreground

                        [&_h3]:mb-4
                        [&_h3]:mt-6
                        [&_h3]:text-xl
                        [&_h3]:font-bold
                        [&_h3]:leading-tight
                        [&_h3]:text-foreground

                        [&_strong]:font-bold
                        [&_strong]:text-foreground

                        [&_em]:font-semibold
                        [&_em]:italic

                        [&_ul]:my-5
                        [&_ul]:ml-10
                        [&_ul]:list-disc
                        [&_ul]:space-y-1

                        [&_ol]:my-5
                        [&_ol]:ml-10
                        [&_ol]:list-decimal
                        [&_ol]:space-y-1

                        [&_li]:pl-2
                        [&_li]:leading-normal

                        [&_blockquote]:mx-auto
                        [&_blockquote]:my-8
                        [&_blockquote]:max-w-3xl
                        [&_blockquote]:border-0
                        [&_blockquote]:px-4
                        [&_blockquote]:text-center
                        [&_blockquote]:text-xl
                        [&_blockquote]:font-bold
                        [&_blockquote]:italic
                        [&_blockquote]:leading-relaxed
                        [&_blockquote]:text-foreground

                        [&_a]:font-semibold
                        [&_a]:text-primary
                        [&_a]:underline
                        [&_a]:underline-offset-4

                        [&_img]:my-6
                        [&_img]:h-auto
                        [&_img]:max-w-full
                        [&_img]:rounded-xl

                        [&_table]:my-6
                        [&_table]:w-full
                        [&_table]:border-collapse

                        [&_th]:border
                        [&_th]:border-border
                        [&_th]:bg-muted
                        [&_th]:p-3
                        [&_th]:text-left
                        [&_th]:font-bold
                        [&_th]:text-foreground

                        [&_td]:border
                        [&_td]:border-border
                        [&_td]:p-3
                        [&_td]:align-top

                        [&_code]:rounded
                        [&_code]:bg-muted
                        [&_code]:px-1.5
                        [&_code]:py-0.5
                        [&_code]:font-mono
                        [&_code]:text-sm

                        [&_pre]:my-5
                        [&_pre]:overflow-x-auto
                        [&_pre]:rounded-xl
                        [&_pre]:bg-muted
                        [&_pre]:p-4
                      "
                      dangerouslySetInnerHTML={{
                        __html: module.description,
                      }}
                    />
                  )}

                  {/* =================================================
                      LESSON COUNT
                  ================================================= */}

                  <div className="mt-6 border-t border-border/60 pt-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      {module._count.lessons}{" "}
                      lesson
                      {module._count.lessons !== 1
                        ? "s"
                        : ""}
                    </p>
                  </div>
                </div>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div className="flex shrink-0 flex-wrap gap-2">

                  {/* VIEW LESSONS */}

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link
                      href={`/instructor/courses/${course.slug}/modules/${module.id}`}
                    >
                      View Lessons
                    </Link>
                  </Button>

                  {/* QUIZ */}

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link
                      href={`/instructor/courses/${course.slug}/modules/${module.id}/quizzes/new`}
                    >
                      <ClipboardList className="mr-1 h-4 w-4" />

                      Quiz
                    </Link>
                  </Button>

                  {/* EDIT */}

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link
                      href={`/instructor/courses/${course.slug}/modules/${module.id}/edit`}
                    >
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (

          /* =====================================================
             EMPTY STATE
          ===================================================== */

          <Card className="border-dashed bg-muted/5 p-12 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

            <p className="text-muted-foreground">
              No modules yet.
            </p>

            <Button
              className="mt-4"
              asChild
            >
              <Link
                href={`/instructor/courses/${course.slug}/modules/new`}
              >
                Create your first module
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}