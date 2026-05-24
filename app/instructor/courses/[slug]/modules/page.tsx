import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, BookOpen, ClipboardList } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export default async function CoursesModulesPage({ params }: Props) {
  const resolvedParams = await params;
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const course = await prisma.course.findUnique({
    where: { slug: resolvedParams.slug },
    include: { instructor: { select: { id: true } } },
  });

  if (!course) return <div>Course not found</div>;
  if (course.instructor.id !== session.userId) return <div>Forbidden</div>;

  const modules = await prisma.module.findMany({
    where: { courseId: course.id },
    include: { _count: { select: { lessons: true } } },
    orderBy: { id: "asc" },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Modules</h1>
          <p className="text-muted-foreground mt-2">{course.title}</p>
        </div>
        <Button asChild>
          <Link href={`/instructor/courses/${course.slug}/modules/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Module
          </Link>
        </Button>
      </header>

      <div className="grid gap-4">
        {modules.length > 0 ? (
          modules.map((module) => (
            <Card key={module.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">{module.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">
                    {module.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {module._count.lessons} lesson
                    {module._count.lessons !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/instructor/courses/${course.slug}/modules/${module.id}`}
                    >
                      View Lessons
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/instructor/courses/${course.slug}/modules/${module.id}/quizzes/new`}
                    >
                      <ClipboardList className="h-4 w-4 mr-1" />
                      Quiz
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
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
          <Card className="p-12 text-center border-dashed bg-muted/5">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No modules yet.</p>
            <Button className="mt-4" asChild>
              <Link href={`/instructor/courses/${course.slug}/modules/new`}>
                Create your first module
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
