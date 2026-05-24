import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { CourseCard } from "@/components/course-card";
import CourseItem from "@/components/instructor/course-item";
import { Button } from "@/components/ui/button";

export default async function InstructorCoursesPage() {
  const session = await getSession();
  const userId = session!.userId;

  const courses = await prisma.course.findMany({
    where: { instructorId: userId },
    include: {
      category: true,
      instructor: { select: { name: true } },
      tags: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = courses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description || "",
    image_url: c.thumbnail || "",
    price: Number(c.price as any),
    discounted_price: c.discount ? Number(c.discount as any) : undefined,
    rating: c.avgRating || 0,
    students: c.studentNumber || 0,
    duration: c.duration || undefined,
    level: c.level ? String(c.level).toLowerCase() : undefined,
    category: c.category?.name || undefined,
    categorySlug: c.category?.slug || undefined,
    slug: c.slug,
    has_certificate: !!c.hasCertificate,
    is_free: Number(c.price as any) === 0,
    instructor: c.instructor?.name || undefined,
    conducting_type: String(c.conductingType || ""),
    has_exam: !!c.hasExam,
    tags: c.tags?.map((t) => t.name) || [],
    reviews_count: c._count?.reviews || 0,
    updated_at: c.updatedAt,
    published: c.published,
  }));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button asChild>
          <Link href="/instructor/courses/new">Create Course</Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mapped.length > 0 ? (
          mapped.map((course) => (
            <CourseItem key={course.id} course={course as any} />
          ))
        ) : (
          <div className="p-8 text-center col-span-full border-dashed bg-muted/5 rounded">
            <p className="text-muted-foreground">
              You have not created any courses yet.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/instructor/courses/new">
                Create your first course
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
