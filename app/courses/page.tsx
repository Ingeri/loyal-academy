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

// Mock courses data - will be replaced with Supabase queries once tables are created
const mockCourses = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript from scratch',
    category: 'Web Development',
    level: 'Beginner',
    price: 49.99,
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=500&h=300&fit=crop',
    rating: 4.8,
    students: 2540,
    duration: '8 weeks',
    instructor: 'Sarah Johnson',
    hasWebinar: true
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    description: 'Master advanced React concepts and best practices',
    category: 'Web Development',
    level: 'Advanced',
    price: 79.99,
    image: 'https://images.pexels.com/photos/3583447/pexels-photo-3583447.jpeg?w=500&h=300&fit=crop',
    rating: 4.9,
    students: 1820,
    duration: '10 weeks',
    instructor: 'Mike Chen'
  },
  {
    id: '3',
    title: 'Data Science Essentials',
    description: 'Introduction to Python, pandas, and data visualization',
    category: 'Data Science',
    level: 'Beginner',
    price: 59.99,
    image: 'https://images.pexels.com/photos/3182751/pexels-photo-3182751.jpeg?w=500&h=300&fit=crop',
    rating: 4.7,
    students: 3200,
    duration: '12 weeks',
    instructor: 'Dr. Emily Rodriguez'
  },
  {
    id: '4',
    title: 'UX/UI Design Bootcamp',
    description: 'Learn design principles, Figma, and user research',
    category: 'Design',
    level: 'Intermediate',
    price: 69.99,
    image: 'https://images.pexels.com/photos/3150150/pexels-photo-3150150.jpeg?w=500&h=300&fit=crop',
    rating: 4.6,
    students: 1540,
    duration: '10 weeks',
    instructor: 'Alex Kim',
    hasWebinar: true
  },
  {
    id: '5',
    title: 'Cloud Architecture with AWS',
    description: 'Deploy and manage applications on AWS',
    category: 'Cloud',
    level: 'Intermediate',
    price: 89.99,
    image: 'https://images.pexels.com/photos/3182759/pexels-photo-3182759.jpeg?w=500&h=300&fit=crop',
    rating: 4.8,
    students: 2100,
    duration: '12 weeks',
    instructor: 'James Park'
  },
  {
    id: '6',
    title: 'Machine Learning Fundamentals',
    description: 'Build your first ML models with scikit-learn',
    category: 'Data Science',
    level: 'Intermediate',
    price: 99.99,
    image: 'https://images.pexels.com/photos/3862627/pexels-photo-3862627.jpeg?w=500&h=300&fit=crop',
    rating: 4.9,
    students: 2800,
    duration: '14 weeks',
    instructor: 'Prof. David Lee'
  },
];

function getCourses(searchQuery?: string, category?: string, level?: string) {
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
    filtered = filtered.filter(c => c.level === level);
  }

  return filtered;
}

function getCategories() {
  return Array.from(new Set(mockCourses.map(c => c.category)));
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; level?: string }>;
}) {
  const params = await searchParams;
  const courses = getCourses(params.q, params.category, params.level);
  const categories = getCategories();

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
                <div className="mb-6 pb-6 border-b border-border">
                  <label className="block text-sm font-medium text-foreground mb-3">Level</label>
                  <div className="space-y-2">
                    <Link href="/courses">
                      <Button
                        variant={!params.level || params.level === 'all' ? 'default' : 'outline'}
                        className="w-full justify-start cursor-pointer hover:shadow-md transition-all"
                      >
                        All Levels
                      </Button>
                    </Link>
                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <Link key={level} href={`/courses?level=${level}`}>
                        <Button
                          variant={params.level === level ? 'default' : 'outline'}
                          className="w-full justify-start cursor-pointer hover:shadow-md transition-all"
                        >
                          {level}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Certification Filter */}
                <div className="mb-6 pb-6 border-b border-border">
                  <label className="block text-sm font-medium text-foreground mb-3">Certifications</label>
                  <div className="space-y-2">
                    {['Industry Certified', 'Professional Certificate', 'Completion Badge'].map((cert) => (
                      <Button
                        key={cert}
                        variant="outline"
                        className="w-full justify-start cursor-pointer hover:shadow-md transition-all"
                      >
                        {cert}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Qualification Filter */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Qualifications</label>
                  <div className="space-y-2">
                    {['Job Ready', 'Skill Badge', 'Portfolio Project'].map((qual) => (
                      <Button
                        key={qual}
                        variant="outline"
                        className="w-full justify-start cursor-pointer hover:shadow-md transition-all"
                      >
                        {qual}
                      </Button>
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
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative">
                        {course.hasWebinar && (
                          <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
                            Live Webinar
                          </div>
                        )}
                        {course.image && (
                          <img
                            src={course.image}
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
