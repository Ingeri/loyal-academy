import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { CourseCard } from '@/components/course-card';
import { Search, Filter, X, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Courses - Loyal Academy',
  description: 'Browse our comprehensive collection of online courses',
};


async function getCoursesFromDB(searchQuery?: string, categorySlug?: string, level?: string, tag?: string) {
  try {
    const whereClause: any = {
      published: true, // using 'published' from schema instead of 'is_published'
    };

    if (searchQuery) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    if (categorySlug && categorySlug !== 'all') {
      whereClause.category = {
        slug: categorySlug
      };
    }

    if (tag && tag !== 'all') {
      whereClause.tags = {
        some: { name: tag }
      };
    }

    if (level && level !== 'all') {
      whereClause.level = level.toUpperCase();
    }

    const data = await prisma.course.findMany({
      where: whereClause,
      include: {
        category: true,
        tags: true,
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

async function getTagsFromDB() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    });
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

async function getCategoriesFromDB() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
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
  const currentCategoryName = categories.find((c: any) => c.slug === categorySlug)?.name || (categorySlug?.replace(/-/g, ' ') || 'All Courses');

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumbs */}
      <section className="px-4 py-3 sm:px-6 lg:px-8 bg-gradient-to-r from-background to-muted/20 border-b border-border/50">
        <div className="mx-auto max-w-6xl flex items-center text-sm gap-2">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:underline underline-offset-4 decoration-2">Home</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:underline underline-offset-4 decoration-2">Courses</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          <span className="text-foreground font-medium capitalize">{currentCategoryName}</span>
        </div>
      </section>

      {/* Filters and Courses */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-20 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40 pr-1">
                {/* Search Card */}
                <Card className="p-5 bg-gradient-to-br from-card to-card/50 border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Search className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Search</h3>
                  </div>
                  <form method="get">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        name="q"
                        placeholder="Search courses..."
                        defaultValue={sp.q || ''}
                        className="pl-9 h-10 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </form>
                </Card>

                {/* Filters Card */}
                <Card className="p-5 bg-gradient-to-br from-card to-card/50 border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Filter className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Filters</h3>
                    </div>
                    {(categorySlug || sp.level || sp.q) && (
                      <Link href="/courses">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs hover:bg-destructive/10 hover:text-destructive transition-colors">
                          <X className="h-3.5 w-3.5 mr-1" /> Clear
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="mb-5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Category</label>
                    <div className="flex flex-col gap-1">
                      <Link href={`/courses${sp.level ? `?level=${sp.level}` : ''}${sp.tag ? `${sp.level ? '&' : '?'}tag=${sp.tag}` : ''}${sp.q ? `${sp.level || sp.tag ? '&' : '?'}q=${sp.q}` : ''}`}>
                        <Button
                          variant={!categorySlug ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start h-9 text-sm font-medium"
                        >
                          All Categories
                        </Button>
                      </Link>
                      {categories.map((cat: { id: string, name: string, slug: string }) => (
                        <Link
                          key={cat.id}
                          href={`/courses/${cat.slug}${sp.level ? `?level=${sp.level}` : ''}${sp.tag ? `?tag=${sp.tag}` : ''}${sp.q ? `&q=${sp.q}` : ''}`}
                        >
                          <Button
                            variant={categorySlug === cat.slug ? 'secondary' : 'ghost'}
                            size="sm"
                            className="w-full justify-start h-9 text-sm hover:bg-muted/50 transition-colors"
                          >
                            {cat.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Level Filter */}
                  <div className="mb-5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Level</label>
                    <div className="flex flex-col gap-1">
                      <Link href={`/courses/${categorySlug}${sp.tag ? `?tag=${sp.tag}` : ''}${sp.q ? `${sp.tag ? '&' : '?'}q=${sp.q}` : ''}`}>
                        <Button
                          variant={!sp.level || sp.level === 'all' ? 'secondary' : 'ghost'}
                          size="sm"
                          className="w-full justify-start h-9 text-sm font-medium"
                        >
                          All Levels
                        </Button>
                      </Link>
                      {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <Link
                          key={level}
                          href={`/courses/${categorySlug}?level=${level}${sp.tag ? `&tag=${sp.tag}` : ''}${sp.q ? `&q=${sp.q}` : ''}`}
                        >
                          <Button
                            variant={sp.level === level ? 'secondary' : 'ghost'}
                            size="sm"
                            className="w-full justify-start h-9 text-sm capitalize hover:bg-muted/50 transition-colors"
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
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Skills & Tags</label>
                      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
                        <Link href={`/courses/${categorySlug}${sp.level ? `?level=${sp.level}` : ''}${sp.q ? `${sp.level ? '&' : '?'}q=${sp.q}` : ''}`}>
                          <Button
                            variant={!sp.tag || sp.tag === 'all' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="w-full justify-start h-9 text-sm font-medium"
                          >
                            All Tags
                          </Button>
                        </Link>
                        {tags.map((t: { id: string, name: string }) => (
                          <Link
                            key={t.id}
                            href={`/courses/${categorySlug}?tag=${encodeURIComponent(t.name)}${sp.level ? `&level=${sp.level}` : ''}${sp.q ? `&q=${sp.q}` : ''}`}
                          >
                            <Button
                              variant={sp.tag === t.name ? 'secondary' : 'ghost'}
                              size="sm"
                              className="w-full justify-start h-9 text-sm hover:bg-muted/50 transition-colors"
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
                      Master your skills with our top-rated {currentCategoryName} courses. Explore carefully structured learning paths tailored for all levels.
                    </p>
                  </div>
                  <div className="bg-primary/10 px-6 py-4 rounded-xl text-center shrink-0 border border-primary/10">
                    <span className="block text-3xl font-black text-primary font-sans">{courses.length}</span>
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 block">Total Courses</span>
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
                        slug: course.slug || course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        categorySlug: course.category?.slug || (typeof course.category === 'string' ? course.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'uncategorized'),
                        title: course.title,
                        description: course.description,
                        image_url: course.thumbnail || course.image_url,
                        price: course.price ? Number(course.price) : 49.99,
                        discounted_price: course.discount ? Number(course.price) - Number(course.discount) : undefined,
                        rating: course.avgRating || 0,
                        students: course.studentNumber || 0,
                        duration: course.duration || 'Self-paced',
                        level: course.level || 'Beginner',
                        category: course.category?.name || course.category || 'Uncategorized',
                        instructor: course.instructor?.full_name || 'Expert Instructor',
                        has_certificate: course.hasCertificate ?? true,
                        conducting_type: course.conductingType || 'Online',
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
                  <p className="text-muted-foreground mb-4">No courses found matching your criteria.</p>
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
