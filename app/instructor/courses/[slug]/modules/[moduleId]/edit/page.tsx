import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import ModuleForm from "@/components/instructor/module-form";

type Props = {
  params: Promise<{
    slug: string;
    moduleId: string;
  }>;
};

export default async function EditModulePage({
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

    select: {
      id: true,
      title: true,
      slug: true,

      instructor: {
        select: {
          id: true,
        },
      },
    },
  });

  // =========================================================
  // COURSE VALIDATION
  // =========================================================

  if (!course) {
    notFound();
  }

  // =========================================================
  // AUTHORIZATION
  // =========================================================

  if (course.instructor.id !== session.userId) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold">
          Forbidden
        </h1>

        <p className="mt-2 text-muted-foreground">
          You do not have permission to edit this
          course.
        </p>
      </div>
    );
  }

  // =========================================================
  // GET MODULE
  // =========================================================

  const module = await prisma.module.findFirst({
    where: {
      id: moduleId,
      courseId: course.id,
    },

    select: {
      id: true,
      title: true,
      description: true,
      order: true,
      courseId: true,
    },
  });

  // =========================================================
  // MODULE VALIDATION
  // =========================================================

  if (!module) {
    notFound();
  }

  // =========================================================
  // EDIT MODULE FORM
  // =========================================================

  return (
    <ModuleForm
      courseId={course.id}
      courseSlug={course.slug}
      moduleId={module.id}
      initialTitle={module.title}
      initialDescription={module.description ?? ""}
    />
  );
}