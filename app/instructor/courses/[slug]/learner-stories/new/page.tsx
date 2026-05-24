import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import LearnerStoryForm from "@/components/instructor/learner-story-form";

type Props = { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string }>;
};

export default async function LearnerStoryFormPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const course = await prisma.course.findUnique({
    where: { slug: resolvedParams.slug },
    select: { id: true, slug: true, instructorId: true },
  });

  if (!course) return <div>Course not found</div>;
  if (course.instructorId !== session.userId) return <div>Forbidden</div>;

  let initialStories = undefined;
  let isEdit = false;

  if (resolvedSearchParams.edit) {
    isEdit = true;
    const story = await prisma.learnerStory.findUnique({
      where: { id: resolvedSearchParams.edit },
    });

    if (story) {
      initialStories = [{
        id: story.id,
        name: story.name,
        role: story.role || undefined,
        story: story.story,
        image: story.image || undefined,
      }];
    }
  }

  return (
    <LearnerStoryForm
      courseId={course.id}
      courseSlug={course.slug}
      initialStories={initialStories}
      isEdit={isEdit}
    />
  );
}
