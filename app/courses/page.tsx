import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { CourseCard } from "@/components/course-card";
import { Search, Filter, X } from "lucide-react";

export const metadata = {
  title: "Courses - Loyal Academy",
  description: "Browse our comprehensive collection of online courses",
};

// Mock courses for development
const mockCourses = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description:
      "Learn HTML, CSS, and JavaScript from scratch. Build real projects and master the basics.",
    category: "Web Development",
    level: "beginner",
    price: 49.99,
    image_url:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=500&h=300&fit=crop",
    rating: 4.8,
    total_students: 2540,
    duration_weeks: 8,
    instructor: { full_name: "Sarah Johnson" },
    has_certificate: true,
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description:
      "Master advanced React concepts including hooks, context, and performance optimization.",
    category: "Web Development",
    level: "advanced",
    price: 79.99,
    image_url:
      "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?w=800&h=400&fit=crop",
    rating: 4.9,
    total_students: 1820,
    duration_weeks: 10,
    instructor: { full_name: "Mike Chen" },
    has_certificate: true,
  },
  {
    id: "3",
    title: "Data Science Essentials",
    description:
      "Introduction to Python, pandas, and data visualization. Learn to analyze real datasets.",
    category: "Data Science",
    level: "beginner",
    price: 59.99,
    image_url:
      "https://images.pexels.com/photos/3182751/pexels-photo-3182751.jpeg?w=500&h=300&fit=crop",
    rating: 4.7,
    total_students: 3200,
    duration_weeks: 12,
    instructor: { full_name: "Dr. Emily Rodriguez" },
    has_certificate: true,
  },
  {
    id: "4",
    title: "UX/UI Design Bootcamp",
    description:
      "Learn design principles, Figma, and user research. Build a professional portfolio.",
    category: "Design",
    level: "intermediate",
    price: 69.99,
    image_url:
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?w=800&h=400&fit=crop",
    rating: 4.6,
    total_students: 1540,
    duration_weeks: 10,
    instructor: { full_name: "Alex Kim" },
    has_certificate: true,
  },
  {
    id: "5",
    title: "Cloud Architecture with AWS",
    description:
      "Deploy and manage applications on AWS. Learn EC2, S3, Lambda, and more.",
    category: "Cloud",
    level: "intermediate",
    price: 89.99,
    image_url:
      "https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?w=500&h=300&fit=crop",
    rating: 4.8,
    total_students: 2100,
    duration_weeks: 12,
    instructor: { full_name: "James Park" },
    has_certificate: true,
  },
  {
    id: "6",
    title: "Machine Learning Fundamentals",
    description:
      "Build your first ML models with scikit-learn. From theory to practical applications.",
    category: "Data Science",
    level: "intermediate",
    price: 99.99,
    image_url:
      "https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?w=500&h=300&fit=crop",
    rating: 4.9,
    total_students: 2800,
    duration_weeks: 14,
    instructor: { full_name: "Prof. David Lee" },
    has_certificate: true,
  },
];

const mockCategories = [
  "Web Development",
  "Data Science",
  "Design",
  "Cloud",
  "AI & ML",
  "Business",
];

function filterMockCourses(
  searchQuery?: string,
  category?: string,
  level?: string,
) {
  let filtered = [...mockCourses];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query),
    );
  }

  if (category && category !== "all") {
    filtered = filtered.filter((c) => c.category === category);
  }

  if (level && level !== "all") {
    filtered = filtered.filter((c) => c.level === level.toLowerCase());
  }

  return filtered;
}

async function getCoursesFromDB(
  searchQuery?: string,
  categorySlug?: string,
  level?: string,
  tag?: string,
) {
  try {
    const whereClause: any = {
      published: true, // using 'published' from schema instead of 'is_published'
    };

    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    if (categorySlug && categorySlug !== "all") {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    if (tag && tag !== "all") {
      whereClause.tags = {
        some: { name: tag },
      };
    }

    if (level && level !== "all") {
      whereClause.level = level.toUpperCase();
    }

    const data = await prisma.course.findMany({
      where: whereClause,
      include: {
        category: true,
        tags: true,
        _count: {
          select: { reviews: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data || data.length === 0) {
      return filterMockCourses(searchQuery, categorySlug, level);
    }

    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return filterMockCourses(searchQuery, categorySlug, level);
  }
}

async function getTagsFromDB() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    });
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

async function getCategoriesFromDB() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    if (categories.length > 0) {
      return categories;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  // Fallback map mock categories to object shape expected
  return mockCategories.map((name) => ({
    id: name,
    name: name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }));
}

export default async function CategoryCoursesPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ q?: string; level?: string; tag?: string }>;
}) {
  const { categorySlug } = await params;
  const sp = await searchParams;
  const courses = await getCoursesFromDB(sp.q, categorySlug, sp.level, sp.tag);
  const categories = await getCategoriesFromDB();
  const tags = await getTagsFromDB();
  const currentCategoryName =
    categories.find((c: any) => c.slug === categorySlug)?.name ||
    categorySlug.replace(/-/g, " ");

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumbs */}
      <section className="px-4 py-4 sm:px-6 lg:px-8 border-b">
        <div className="mx-auto max-w-6xl flex items-center text-sm text-muted-foreground gap-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/courses"
            className="hover:text-primary transition-colors"
          >
            Courses
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium capitalize">
            {currentCategoryName}
          </span>
        </div>
      </section>

      {/* Filters and Courses */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Search Card */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Search</h3>
                  </div>
                  <form method="get">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        name="q"
                        placeholder="Search courses..."
                        defaultValue={sp.q || ""}
                        className="pl-9"
                      />
                    </div>
                  </form>
                </Card>

                {/* Filters Card */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Filters</h3>
                    </div>
                    {(categorySlug || sp.level || sp.q) && (
                      <Link href="/courses">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <X className="h-4 w-4 mr-1" /> Clear
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Category
                    </label>
                    <div className="flex flex-col gap-1.5">
                      <Link
                        href={`/courses${sp.level ? `?level=${sp.level}` : ""}${sp.tag ? `${sp.level ? "&" : "?"}tag=${sp.tag}` : ""}${sp.q ? `${sp.level || sp.tag ? "&" : "?"}q=${sp.q}` : ""}`}
                      >
                        <Button
                          variant={!categorySlug ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                        >
                          All Categories
                        </Button>
                      </Link>
                      {categories.map(
                        (cat: { id: string; name: string; slug: string }) => (
                          <Link
                            key={cat.id}
                            href={`/courses/${cat.slug}${sp.level ? `?level=${sp.level}` : ""}${sp.tag ? `?tag=${sp.tag}` : ""}${sp.q ? `&q=${sp.q}` : ""}`}
                          >
                            <Button
                              variant={
                                categorySlug === cat.slug
                                  ? "secondary"
                                  : "ghost"
                              }
                              size="sm"
                              className="w-full justify-start"
                            >
                              {cat.name}
                            </Button>
                          </Link>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Level Filter */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Level
                    </label>
                    <div className="flex flex-col gap-1.5">
                      <Link
                        href={`/courses/${categorySlug}${sp.tag ? `?tag=${sp.tag}` : ""}${sp.q ? `${sp.tag ? "&" : "?"}q=${sp.q}` : ""}`}
                      >
                        <Button
                          variant={
                            !sp.level || sp.level === "all"
                              ? "secondary"
                              : "ghost"
                          }
                          size="sm"
                          className="w-full justify-start"
                        >
                          All Levels
                        </Button>
                      </Link>
                      {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <Link
                          key={level}
                          href={`/courses/${categorySlug}?level=${level}${sp.tag ? `&tag=${sp.tag}` : ""}${sp.q ? `&q=${sp.q}` : ""}`}
                        >
                          <Button
                            variant={sp.level === level ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start capitalize"
                          >
                            {level}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Tag Filter */}
                  {tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        Skills & Tags
                      </label>
                      <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-2">
                        <Link
                          href={`/courses/${categorySlug}${sp.level ? `?level=${sp.level}` : ""}${sp.q ? `${sp.level ? "&" : "?"}q=${sp.q}` : ""}`}
                        >
                          <Button
                            variant={
                              !sp.tag || sp.tag === "all"
                                ? "secondary"
                                : "ghost"
                            }
                            size="sm"
                            className="w-full justify-start"
                          >
                            All Tags
                          </Button>
                        </Link>
                        {tags.map((t: { id: string; name: string }) => (
                          <Link
                            key={t.id}
                            href={`/courses/${categorySlug}?tag=${encodeURIComponent(t.name)}${sp.level ? `&level=${sp.level}` : ""}${sp.q ? `&q=${sp.q}` : ""}`}
                          >
                            <Button
                              variant={
                                sp.tag === t.name ? "secondary" : "ghost"
                              }
                              size="sm"
                              className="w-full justify-start"
                            >
                              {t.name}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="lg:col-span-3">
              {/* Category Details & Count Card */}
              <Card className="p-8 mb-8 bg-muted/40 border-primary/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-foreground font-sans capitalize">
                      {currentCategoryName} Courses
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
                      Master your skills with our top-rated{" "}
                      {currentCategoryName} courses. Explore carefully
                      structured learning paths tailored for all levels.
                    </p>
                  </div>
                  <div className="bg-primary/10 px-6 py-4 rounded-xl text-center shrink-0 border border-primary/10">
                    <span className="block text-3xl font-black text-primary font-sans">
                      {courses.length}
                    </span>
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 block">
                      Total Courses
                    </span>
                  </div>
                </div>
              </Card>

              {courses.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                  {courses.map((course: any) => (
                    <CourseCard
                      key={course.id}
                      course={{
                        id: course.id,
                        slug:
                          course.slug ||
                          course.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-"),
                        categorySlug:
                          course.category?.slug ||
                          (typeof course.category === "string"
                            ? course.category
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                            : "uncategorized"),
                        title: course.title,
                        description: course.description,
                        image_url: course.thumbnail || course.image_url,
                        price: course.price ? Number(course.price) : 49.99,
                        discounted_price: course.discount
                          ? Number(course.price) - Number(course.discount)
                          : undefined,
                        rating: course.avgRating || 0,
                        students: course.studentNumber || 0,
                        duration: course.duration || "Self-paced",
                        level: course.level || "Beginner",
                        category:
                          course.category?.name ||
                          course.category ||
                          "Uncategorized",
                        instructor:
                          course.instructor?.full_name || "Expert Instructor",
                        has_certificate: course.hasCertificate ?? true,
                        conducting_type: course.conductingType || "Online",
                        has_exam: course.hasExam || false,
                        tags: course.tags?.map((t: any) => t.name) || [],
                        reviews_count: course._count?.reviews || 0,
                        updated_at: course.updatedAt,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No courses found matching your criteria.
                  </p>
                  <Link href="/courses">
                    <Button>Clear filters</Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
