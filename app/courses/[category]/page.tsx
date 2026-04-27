import { allCourses } from "@/lib/courses";
import CourseCard from "@/components/courses/CourseCard";
import { notFound } from "next/navigation";

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category } = await params;

  // Filter the JSON data for this specific category
  const filteredCourses = allCourses.filter(
    (course) => course.categorySlug === category.toLowerCase()
  );

  // If the category doesn't exist in our data, show 404
  if (filteredCourses.length === 0) {
    notFound();
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="container mx-auto px-4">
        <header className="mb-12">
          <h1 className="text-4xl font-serif font-bold capitalize mb-2">
            {filteredCourses[0].category} Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Explore our elite curriculum in {filteredCourses[0].category}.
          </p>
        </header>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}