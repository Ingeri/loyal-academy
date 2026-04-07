import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Search, Star } from 'lucide-react';

export const metadata = {
  title: 'Courses - Loyal Academy',
  description: 'Browse our comprehensive collection of online courses',
};

async function getCourses(searchQuery?: string, category?: string, level?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (level && level !== 'all') {
    query = query.eq('level', level);
  }

  const { data } = await query;
  return data || [];
}

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('category')
    .eq('is_published', true)
    .distinct();
  
  return Array.from(new Set(data?.map(c => c.category).filter(Boolean))) || [];
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; level?: string }>;
}) {
  const params = await searchParams;
  const courses = await getCourses(params.q, params.category, params.level);
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-primary/10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">Browse Courses</h1>
          <p className="text-lg text-muted-foreground">Find the perfect course to advance your skills</p>
        </div>
      </section>

      {/* Filters and Courses */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="font-semibold text-foreground mb-4">Filters</h3>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Search</label>
                  <form method="get">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        name="q"
                        placeholder="Search courses..."
                        defaultValue={params.q || ''}
                        className="pl-8"
                      />
                    </div>
                  </form>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">Category</label>
                  <div className="space-y-2">
                    <Link href="/courses">
                      <Button
                        variant={!params.category || params.category === 'all' ? 'default' : 'outline'}
                        className="w-full justify-start"
                      >
                        All Categories
                      </Button>
                    </Link>
                    {categories.map((cat) => (
                      <Link key={cat} href={`/courses?category=${cat}`}>
                        <Button
                          variant={params.category === cat ? 'default' : 'outline'}
                          className="w-full justify-start"
                        >
                          {cat}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Level</label>
                  <div className="space-y-2">
                    <Link href="/courses">
                      <Button
                        variant={!params.level || params.level === 'all' ? 'default' : 'outline'}
                        className="w-full justify-start"
                      >
                        All Levels
                      </Button>
                    </Link>
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <Link key={level} href={`/courses?level=${level}`}>
                        <Button
                          variant={params.level === level ? 'default' : 'outline'}
                          className="w-full justify-start capitalize"
                        >
                          {level}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="lg:col-span-3">
              {courses.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                  {courses.map((course: any) => (
                    <Link key={course.id} href={`/courses/${course.id}`}>
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        {course.image_url && (
                          <img
                            src={course.image_url}
                            alt={course.title}
                            className="h-48 w-full object-cover"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground line-clamp-2 mb-1">{course.title}</h3>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {course.rating ? course.rating.toFixed(1) : 'New'}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-primary text-lg">${course.price}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded capitalize">
                              {course.level}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
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
