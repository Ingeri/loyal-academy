import { getCourses as getCoursesAction } from "@/lib/actions/admin/courses";
import { Level } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search, Eye, EyeOff, BookOpen } from "lucide-react";
import CourseFilters from "@/components/admin/course-filters";

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    published?: string;
    level?: Level;
    instructor?: string;
  }>;
}) {
  const params = await searchParams;
  const publishedFilter =
    params.published === "true"
      ? true
      : params.published === "false"
        ? false
        : undefined;

  const courses = await getCoursesAction(
    params.category,
    publishedFilter,
    params.level as Level,
    params.q,
    params.instructor,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="mt-1 text-muted-foreground">
            Manage all your courses from one place
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="p-4">
        <CourseFilters />
      </Card>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid gap-4">
          {courses.map((course: any) => (
            <Card
              key={course.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <Badge variant={course.published ? "default" : "secondary"}>
                      {course.published ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" /> Draft
                        </>
                      )}
                    </Badge>
                    {course.category && (
                      <Badge variant="outline">{course.category.name}</Badge>
                    )}
                    <Badge variant="outline" className="capitalize">
                      {course.level}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {course._count.enrollments} students
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:justify-end">
                  <Link href={`/admin/courses/${course.slug}/preview`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/admin/courses/${course.slug}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-6">
            {params.q || params.published || params.level
              ? "No courses found matching your filters."
              : "No courses found yet."}
          </p>
        </Card>
      )}
    </div>
  );
}
