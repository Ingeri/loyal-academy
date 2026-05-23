import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import CourseEditForm from "@/components/instructor/course-edit-form";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList, HelpCircle, UserCircle } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export default async function EditCoursePage({ params }: Props) {
  const resolvedParams = await params;
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  if (!resolvedParams?.slug) {
    return <div>Course slug is missing from the route.</div>;
  }

  const course = await prisma.course.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true },
  });

  if (!course) return <div>Course not found</div>;

  if (course.instructorId !== session.userId) return <div>Forbidden</div>;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" asChild>
            <Link href={`/instructor/courses/${course.slug}/quizzes`}>
              <ClipboardList className="mr-2 h-4 w-4" />
              View Quizzes
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/instructor/courses/${course.slug}/faqs`}>
              <HelpCircle className="mr-2 h-4 w-4" />
              View FAQs
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/instructor/courses/${course.slug}/learner-stories`}>
              <UserCircle className="mr-2 h-4 w-4" />
              View Learner Stories
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/instructor/courses/${course.slug}/quizzes/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Quiz
            </Link>
          </Button>
        </div>
      </div>
      <CourseEditForm
        initialCourse={{
          id: course.id,
          title: course.title,
          description: course.description || "",
          thumbnail: course.thumbnail || "",
          categoryId: course.categoryId,
          price: String(course.price as any),
          level: String(course.level),
          duration: course.duration || "",
          hasCertificate: Boolean(course.hasCertificate),
          hasExam: Boolean(course.hasExam),
          conductingType: String(course.conductingType || "Online"),
          overview: course.overview || [],
          learningOutcomes: course.learningOutcomes || [],
          careerFields: course.careerFields || [],
          hiringSectors: course.hiringSectors || [],
          discount: course.discount ? String(course.discount as any) : "",
          growthPercentage: course.growthPercentage
            ? String(course.growthPercentage)
            : "",
          estimatedSalary: course.estimatedSalary || "",
          expectedIncome: course.expectedIncome || "",
          published: course.published,
        }}
        categories={categories}
      />
    </div>
  );
}
