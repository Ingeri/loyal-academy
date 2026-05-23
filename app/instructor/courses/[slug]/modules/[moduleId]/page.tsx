import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, ArrowLeft, ClipboardList } from "lucide-react";

type Props = {
  params: Promise<{ slug: string; moduleId: string }>;
};

export default async function ModuleLessonsPage({ params }: Props) {
  const resolvedParams = await params;
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const course = await prisma.course.findUnique({
    where: { slug: resolvedParams.slug },
    include: { instructor: { select: { id: true } } },
  });

  if (!course) return <div>Course not found</div>;
  if (course.instructor.id !== session.userId) return <div>Forbidden</div>;

  const module = await prisma.module.findUnique({
    where: { id: resolvedParams.moduleId },
    include: { course: { select: { id: true } } },
  });

  if (!module) return <div>Module not found</div>;
  if (module.course.id !== course.id) return <div>Invalid module</div>;

  const lessons = await prisma.lesson.findMany({
    where: { moduleId: resolvedParams.moduleId },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/instructor/courses/${course.slug}/modules`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Module Lessons</h1>
            <p className="text-muted-foreground mt-2">
              {module.title} • {course.title}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link
              href={`/instructor/courses/${course.slug}/modules/${module.id}/quizzes`}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              View Quizzes
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href={`/instructor/courses/${course.slug}/modules/${module.id}/quizzes/new`}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Add Quiz
            </Link>
          </Button>
          <Button asChild>
            <Link
              href={`/instructor/courses/${course.slug}/modules/${module.id}/lessons/new`}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Lesson
            </Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-4">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <Card key={lesson.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">{lesson.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Order: {lesson.order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/instructor/courses/${course.slug}/modules/${module.id}/lessons/${lesson.id}/quizzes`}
                    >
                      <ClipboardList className="h-4 w-4 mr-1" />
                      Quizzes
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/instructor/courses/${course.slug}/modules/${module.id}/lessons/${lesson.id}/quizzes/new`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/instructor/courses/${course.slug}/modules/${module.id}/lessons/${lesson.id}/edit`}
                    >
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-dashed bg-muted/5">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No lessons yet.</p>
            <Button className="mt-4" asChild>
              <Link
                href={`/instructor/courses/${course.slug}/modules/${module.id}/lessons/new`}
              >
                Create your first lesson
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
