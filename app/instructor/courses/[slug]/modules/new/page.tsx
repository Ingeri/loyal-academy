import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import ModuleForm from "@/components/instructor/module-form";

type Props = { params: Promise<{ slug: string }> };

export default async function AddModulePage({ params }: Props) {
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

  return <ModuleForm courseId={course.id} courseSlug={course.slug} />;
}
