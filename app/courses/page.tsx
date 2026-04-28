import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { CourseCard } from '@/components/course-card';
import { Search, Filter, X } from 'lucide-react';

export const metadata = {
  title: 'Courses - Loyal Academy',
  description: 'Browse our comprehensive collection of online courses',
};

// Mock courses for development
const mockCourses = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript from scratch. Build real projects and master the basics.',
    category: 'Web Development',
    level: 'beginner',
    price: 49.99,
    image_url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=500&h=300&fit=crop',
    rating: 4.8,
    total_students: 2540,
    duration_weeks: 8,
    instructor: { full_name: 'Sarah Johnson' },
    has_certificate: true,
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    description: 'Master advanced React concepts including hooks, context, and performance optimization.',
    category: 'Web Development',
    level: 'advanced',
    price: 79.99,
    image_url: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?w=800&h=400&fit=crop',
    rating: 4.9,
    total_students: 1820,
    duration_weeks: 10,
    instructor: { full_name: 'Mike Chen' },
    has_certificate: true,
  },
  {
    id: '3',
    title: 'Data Science Essentials',
    description: 'Introduction to Python, pandas, and data visualization. Learn to analyze real datasets.',
    category: 'Data Science',
    level: 'beginner',
    price: 59.99,
    image_url: 'https://images.pexels.com/photos/3182751/pexels-photo-3182751.jpeg?w=500&h=300&fit=crop',
    rating: 4.7,
    total_students: 3200,
    duration_weeks: 12,
    instructor: { full_name: 'Dr. Emily Rodriguez' },
    has_certificate: true,
  },
  {
    id: '4',
    title: 'UX/UI Design Bootcamp',
    description: 'Learn design principles, Figma, and user research. Build a professional portfolio.',
    category: 'Design',
    level: 'intermediate',
    price: 69.99,
    image_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?w=800&h=400&fit=crop',
    rating: 4.6,
    total_students: 1540,
    duration_weeks: 10,
    instructor: { full_name: 'Alex Kim' },
    has_certificate: true,
  },
  {
    id: '5',
    title: 'Cloud Architecture with AWS',
    description: 'Deploy and manage applications on AWS. Learn EC2, S3, Lambda, and more.',
    category: 'Cloud',
    level: 'intermediate',
    price: 89.99,
    image_url: 'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?w=500&h=300&fit=crop',
    rating: 4.8,
    total_students: 2100,
    duration_weeks: 12,
    instructor: { full_name: 'James Park' },
    has_certificate: true,
  },
  {
    id: '6',
    title: 'Machine Learning Fundamentals',
    description: 'Build your first ML models with scikit-learn. From theory to practical applications.',
    category: 'Data Science',
    level: 'intermediate',
    price: 99.99,
    image_url: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?w=500&h=300&fit=crop',
    rating: 4.9,
    total_students: 2800,
    duration_weeks: 14,
    instructor: { full_name: 'Prof. David Lee' },
    has_certificate: true,
  },
];

const mockCategories = ['Web Development', 'Data Science', 'Design', 'Cloud', 'AI & ML', 'Business'];

function filterMockCourses(searchQuery?: string, category?: string, level?: string) {
  let filtered = [...mockCourses];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
    );
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(c => c.category === category);
  }

  if (level && level !== 'all') {
    filtered = filtered.filter(c => c.level === level.toLowerCase());
  }

  return filtered;
}

async function getCoursesFromDB(searchQuery?: string, category?: string, level?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('courses')
    .select(`
      *,
      instructor:instructor_id (full_name)
    `)
    .eq('is_published', true);

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (level && level !== 'all') {
    query = query.eq('level', level.toLowerCase());
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching courses:', error);
    // Fallback to mock data on error
    return filterMockCourses(searchQuery, category, level);
  }

  // Fallback to mock data if no courses in DB
  if (!data || data.length === 0) {
    return filterMockCourses(searchQuery, category, level);
  }

  return data;
}

async function getCategoriesFromDB() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('category')
    .eq('is_published', true)
    .not('category', 'is', null);

  if (error) {
    console.error('Error fetching categories:', error);
    return mockCategories;
  }

  const dbCategories = Array.from(new Set(data?.map((c: { category: string }) => c.category).filter(Boolean))) as string[];
  return dbCategories.length > 0 ? dbCategories : mockCategories;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; level?: string }>;
}) {
  const params = await searchParams;
  const courses = await getCoursesFromDB(params.q, params.category, params.level);
  const categories = await getCategoriesFromDB();

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
                        defaultValue={params.q || ''}
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
                    {(params.category || params.level || params.q) && (
                      <Link href="/courses">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <X className="h-4 w-4 mr-1" /> Clear
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-foreground mb-3 block">Category</label>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/courses${params.level ? `?level=${params.level}` : ''}${params.q ? `${params.level ? '&' : '?'}q=${params.q}` : ''}`}>
                        <Button
                          variant={!params.category || params.category === 'all' ? 'default' : 'outline'}
                          size="sm"
                        >
                          All
                        </Button>
                      </Link>
                      {categories.map((cat: string) => (
                        <Link
                          key={cat}
                          href={`/courses?category=${cat}${params.level ? `&level=${params.level}` : ''}${params.q ? `&q=${params.q}` : ''}`}
                        >
                          <Button
                            variant={params.category === cat ? 'default' : 'outline'}
                            size="sm"
                          >
                            {cat}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Level</label>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/courses${params.category ? `?category=${params.category}` : ''}${params.q ? `${params.category ? '&' : '?'}q=${params.q}` : ''}`}>
                        <Button
                          variant={!params.level || params.level === 'all' ? 'default' : 'outline'}
                          size="sm"
                        >
                          All
                        </Button>
                      </Link>
                      {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <Link
                          key={level}
                          href={`/courses?level=${level}${params.category ? `&category=${params.category}` : ''}${params.q ? `&q=${params.q}` : ''}`}
                        >
                          <Button
                            variant={params.level === level ? 'default' : 'outline'}
                            size="sm"
                            className="capitalize"
                          >
                            {level}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="lg:col-span-3">
              {courses.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                  {courses.map((course: any) => (
                    <CourseCard
                      key={course.id}
                      course={{
                        id: course.id,
                        title: course.title,
                        description: course.description,
                        image_url: course.image_url,
                        price: course.price,
                        rating: course.rating,
                        students: course.total_students,
                        duration: course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced',
                        level: course.level,
                        category: course.category,
                        instructor: course.instructor?.full_name || 'Expert Instructor',
                        has_certificate: true,
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
