import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, HelpCircle, ArrowLeft, Edit } from "lucide-react";
import DeleteButton from "@/components/instructor/delete-button";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseFAQsPage({ params }: Props) {
  const resolvedParams = await params;
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const course = await prisma.course.findUnique({
    where: { slug: resolvedParams.slug },
    include: { instructor: { select: { id: true } } },
  });

  if (!course) return <div>Course not found</div>;
  if (course.instructor.id !== session.userId) return <div>Forbidden</div>;

  const faqs = await prisma.fAQ.findMany({
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
            <h1 className="text-3xl font-bold">Course FAQs</h1>
            <p className="text-muted-foreground mt-2">{course.title}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/instructor/courses/${course.slug}/faqs/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add FAQs
          </Link>
        </Button>
      </header>

      <div className="grid gap-4">
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <Card key={faq.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold">{faq.question}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/instructor/courses/${course.slug}/faqs/new?edit=${faq.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteButton url={`/api/instructor/courses/${course.id}/faqs?id=${faq.id}`} />
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-dashed bg-muted/5">
            <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No FAQs yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add frequently asked questions to help your students.
            </p>
            <Button className="mt-4" asChild>
              <Link href={`/instructor/courses/${course.slug}/faqs/new`}>
                Create your first FAQ
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
