import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Loyal Academy - Online Learning Platform',
  description: 'Transform your skills with industry-leading courses from expert instructors',
};

async function getFeaturedCourses() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .limit(6)
    .order('created_at', { ascending: false });
  return data || [];
}

async function getStats() {
  const supabase = await createClient();
  const [coursesResult, usersResult, enrollmentsResult] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact' }).eq('is_published', true),
    supabase.from('users').select('id', { count: 'exact' }).eq('role', 'student'),
    supabase.from('enrollments').select('id', { count: 'exact' }),
  ]);
  
  return {
    courses: coursesResult.count || 0,
    students: usersResult.count || 0,
    enrollments: enrollmentsResult.count || 0,
  };
}

export default async function Home() {
  const courses = await getFeaturedCourses();
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 via-background to-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Transform Your Skills with Expert-Led Courses
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Learn from industry experts and advance your career with our comprehensive online learning platform.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Link href="/courses">
              <Button size="lg" className="gap-2">
                Explore Courses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-card px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 sm:gap-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary">{stats.courses}+</div>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">Expert Courses</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary">{stats.students}+</div>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">Active Students</p>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary">{stats.enrollments}+</div>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">Learning</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose Loyal Academy?</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <BookOpen className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Comprehensive Curriculum</h3>
              <p className="text-sm text-muted-foreground">Carefully designed courses covering industry standards and best practices.</p>
            </Card>
            <Card className="p-6">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Expert Instructors</h3>
              <p className="text-sm text-muted-foreground">Learn from experienced professionals with years of industry experience.</p>
            </Card>
            <Card className="p-6">
              <Award className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Certifications</h3>
              <p className="text-sm text-muted-foreground">Earn recognized certificates upon course completion to boost your resume.</p>
            </Card>
            <Card className="p-6">
              <TrendingUp className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Career Growth</h3>
              <p className="text-sm text-muted-foreground">Advance your career with skills recognized by top companies worldwide.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      {courses.length > 0 && (
        <section className="bg-card px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Courses</h2>
            <p className="text-muted-foreground mb-12">Start learning from our most popular courses</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    <div className="p-6">
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">${course.price}</span>
                        {course.rating > 0 && (
                          <span className="text-sm text-muted-foreground">⭐ {course.rating.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="mb-8 text-lg opacity-90">Join thousands of students already improving their skills with Loyal Academy.</p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="gap-2">
              Create Your Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
