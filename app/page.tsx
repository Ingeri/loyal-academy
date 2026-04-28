import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, BookOpen, Users, Award, TrendingUp, Play, Sparkles } from 'lucide-react';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { CourseCard } from '@/components/course-card';
import { BentoGrid, BentoGridSkeleton } from '@/components/bento-grid';
import { InstructorCard } from '@/components/instructor-card';
import { Suspense } from 'react';

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

const mockInstructors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    bio: 'Senior web developer with 10+ years of experience in frontend technologies and modern frameworks.',
    specialty: 'Web Development',
    rating: 4.9,
    students: 12540,
    courses: 8,
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    bio: 'React expert and software architect who has built multiple production applications at scale.',
    specialty: 'React & Frontend',
    rating: 4.8,
    students: 8320,
    courses: 6,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    bio: 'PhD in Data Science with 8 years of industry experience in analytics and machine learning.',
    specialty: 'Data Science',
    rating: 4.9,
    students: 15600,
    courses: 12,
  },
  {
    id: '4',
    name: 'Alex Kim',
    bio: 'Design director with 12 years of experience at leading tech companies and startups.',
    specialty: 'UX/UI Design',
    rating: 4.7,
    students: 9800,
    courses: 5,
  },
];

export default async function Home() {
  const courses = await getFeaturedCourses();
  const stats = await getStats();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Glassmorphism Style */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=1920&h=1080&fit=crop"
            alt="Students learning"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>

        <div className="relative px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Join 50,000+ learners worldwide</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Transform Your Skills with{' '}
                  <span className="text-primary">Expert-Led</span> Courses
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl">
                  Learn from industry experts and advance your career with our comprehensive online learning platform. Get certified and boost your resume.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/courses">
                    <Button size="lg" className="gap-2">
                      Explore Courses <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Play className="h-4 w-4" /> Watch Demo
                    </Button>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-background bg-primary/20"
                      />
                    ))}
                  </div>
                  <p>Trusted by students from 100+ countries</p>
                </div>
              </div>

              {/* Right Content - Glassmorphism Card */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-2xl" />
                  <Card className="relative p-8 backdrop-blur-xl bg-white/80 border-white/20 shadow-2xl">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">500+ Expert Courses</p>
                          <p className="text-sm text-muted-foreground">Across 12 categories</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Industry Certificates</p>
                          <p className="text-sm text-muted-foreground">Boost your career</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">Expert Instructors</p>
                          <p className="text-sm text-muted-foreground">Learn from the best</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Glassmorphism Cards */}
      <section className="relative -mt-8 z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 backdrop-blur-sm bg-white/90 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.courses}+</p>
                  <p className="text-sm text-muted-foreground">Expert Courses</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 backdrop-blur-sm bg-white/90 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.students}+</p>
                  <p className="text-sm text-muted-foreground">Active Students</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 backdrop-blur-sm bg-white/90 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">{stats.enrollments}+</p>
                  <p className="text-sm text-muted-foreground">Course Enrollments</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Category Bento-Grid Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Explore by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover courses across a wide range of subjects. From technology to business, find your perfect learning path.
            </p>
          </div>
          <Suspense fallback={<BentoGridSkeleton />}>
            <BentoGrid />
          </Suspense>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Loyal Academy?</h2>
            <p className="text-muted-foreground">Everything you need to advance your career</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Comprehensive Curriculum</h3>
              <p className="text-sm text-muted-foreground">Carefully designed courses covering industry standards and best practices.</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Expert Instructors</h3>
              <p className="text-sm text-muted-foreground">Learn from experienced professionals with years of industry experience.</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Recognized Certificates</h3>
              <p className="text-sm text-muted-foreground">Earn certificates upon completion to boost your resume and LinkedIn.</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Career Growth</h3>
              <p className="text-sm text-muted-foreground">Advance your career with skills recognized by top companies worldwide.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      {courses.length > 0 && (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Featured Courses</h2>
                <p className="text-muted-foreground">Start learning from our most popular courses</p>
              </div>
              <Link href="/courses" className="hidden sm:block">
                <Button variant="outline" className="gap-2">
                  View All Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={{
                    ...course,
                    instructor: course.instructor_name || 'Expert Instructor',
                    students: course.total_students || 0,
                    level: course.level || 'Beginner',
                    duration: course.duration_weeks ? `${course.duration_weeks} weeks` : 'Self-paced',
                  }}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/courses">
                <Button variant="outline" className="gap-2">
                  View All Courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Instructor Spotlight */}
      <section className="bg-muted/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Learn from the Best</h2>
            <p className="text-muted-foreground">Our instructors are industry experts passionate about teaching</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mockInstructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground px-4 py-20 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] bg-[length:20px_20px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of students already improving their skills with Loyal Academy. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started for Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="border-white/30 hover:bg-white/10 gap-2">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
