import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, UserCircle, ArrowLeft, Edit } from "lucide-react";
import DeleteButton from "@/components/instructor/delete-button";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseLearnerStoriesPage({ params }: Props) {
  const resolvedParams = await params;
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const course = await prisma.course.findUnique({
    where: { slug: resolvedParams.slug },
    include: { instructor: { select: { id: true } } },
  });

  if (!course) return <div>Course not found</div>;
  if (course.instructor.id !== session.userId) return <div>Forbidden</div>;

  const learnerStories = await prisma.learnerStory.findMany({
    where: { courseId: course.id },
    orderBy: { id: "asc" },
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
            <h1 className="text-3xl font-bold">Learner Stories</h1>
            <p className="text-muted-foreground mt-2">{course.title}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/instructor/courses/${course.slug}/learner-stories/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Learner Stories
          </Link>
        </Button>
      </header>

      <div className="grid gap-4">
        {learnerStories.length > 0 ? (
          learnerStories.map((story) => (
            <Card key={story.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <UserCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">{story.name}</h3>
                    {story.role && (
                      <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                        {story.role}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{story.story}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/instructor/courses/${course.slug}/learner-stories/new?edit=${story.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteButton url={`/api/instructor/courses/${course.id}/learner-stories?id=${story.id}`} />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-dashed bg-muted/5">
            <UserCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No learner stories yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add learner testimonials and success stories.
            </p>
            <Button className="mt-4" asChild>
              <Link href={`/instructor/courses/${course.slug}/learner-stories/new`}>
                Create your first learner story
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
