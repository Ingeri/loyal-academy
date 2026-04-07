import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Users, Award, Star } from 'lucide-react';

async function getCourse(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (error || !data) return null;
  return data;
}

async function getCourseContent(courseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('course_content')
    .select('*')
    .eq('course_id', courseId)
    .order('order_position', { ascending: true });

  return data || [];
}

async function getInstructor(instructorId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', instructorId)
    .single();

  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourse(id);

  return {
    title: course ? `${course.title} - Loyal Academy` : 'Course - Loyal Academy',
    description: course?.description || 'View this course on Loyal Academy',
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  const [content, instructor] = await Promise.all([
    getCourseContent(course.id),
    getInstructor(course.instructor_id),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Course Header */}
      <section className="bg-gradient-to-b from-primary/20 to-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {course.level}
                </span>
                {course.category && (
                  <span className="text-sm text-muted-foreground">{course.category}</span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">
                    {course.rating ? `${course.rating.toFixed(1)} (${course.total_students || 0} reviews)` : 'New'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{course.total_students || 0} students</span>
                </div>
                {course.duration_weeks && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{course.duration_weeks} weeks</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                {course.image_url && (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg mb-6"
                  />
                )}
                <div className="mb-6">
                  <p className="text-3xl font-bold text-primary mb-2">${course.price}</p>
                  <p className="text-sm text-muted-foreground">Lifetime access</p>
                </div>
                <Link href={`/enroll/${course.id}`} className="w-full">
                  <Button size="lg" className="w-full">
                    Enroll Now
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  30-day money-back guarantee
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Instructor */}
              {instructor && (
                <Card className="p-6 mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-4">About Your Instructor</h2>
                  <div className="flex gap-4">
                    {instructor.avatar_url && (
                      <img
                        src={instructor.avatar_url}
                        alt={instructor.full_name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{instructor.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{instructor.bio}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Course Content */}
              {content.length > 0 && (
                <Card className="p-6 mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Course Content</h2>
                  <div className="space-y-3">
                    {content.map((item: any, index: number) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 bg-muted rounded">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="capitalize bg-background px-2 py-1 rounded">{item.content_type}</span>
                            {item.duration_minutes && <span>{item.duration_minutes} min</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Key Features */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">What You&apos;ll Learn</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Master key concepts and best practices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Build real-world projects and portfolio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Get certified and advance your career</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Learn at your own pace, anytime</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-20">
                {/* Quick Info */}
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">Course Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level</span>
                      <span className="font-medium text-foreground capitalize">{course.level}</span>
                    </div>
                    {course.duration_weeks && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium text-foreground">{course.duration_weeks} weeks</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-medium text-foreground">{content.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Certificate</span>
                      <span className="font-medium text-foreground">Yes</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
