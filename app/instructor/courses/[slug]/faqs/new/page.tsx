import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import FAQForm from "@/components/instructor/faq-form";

type Props = { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ edit?: string }>;
};

export default async function FAQFormPage({ params, searchParams }: Props) {
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

  let initialFAQs = undefined;
  let isEdit = false;

  if (resolvedSearchParams.edit) {
    isEdit = true;
    const faq = await prisma.fAQ.findUnique({
      where: { id: resolvedSearchParams.edit },
    });

    if (faq) {
      initialFAQs = [{
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      }];
    }
  }

  return (
    <FAQForm
      courseId={course.id}
      courseSlug={course.slug}
      initialFAQs={initialFAQs}
      isEdit={isEdit}
    />
  );
}
