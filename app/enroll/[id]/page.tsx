import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Lock, ArrowLeft } from 'lucide-react';

async function getCourse(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single();

  return data;
}

async function checkEnrollment(userId: string, courseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('enrollments')
    .select('id')
    .eq('student_id', userId)
    .eq('course_id', courseId)
    .single();

  return !!data;
}

export default async function EnrollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const course = await getCourse(id);
  if (!course) {
    notFound();
  }

  const isEnrolled = await checkEnrollment(user.id, id);
  if (isEnrolled) {
    redirect(`/learn/${id}`);
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href={`/courses/${id}`} className="mb-6 inline-flex items-center gap-2 text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Back to course
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h1 className="text-3xl font-bold text-foreground mb-6">Complete Your Enrollment</h1>

                <div className="space-y-8">
                  {/* Order Summary */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                    <div className="bg-muted p-6 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-foreground">Course: {course.title}</span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-border">
                        <span className="text-foreground">Price</span>
                        <span className="font-semibold text-foreground">${course.price}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-primary">${course.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">What&apos;s Included</h2>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">Lifetime access to all course materials</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">Downloadable course resources</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">Certificate of completion</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">30-day money-back guarantee</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-foreground">Community forum access</span>
                      </li>
                    </ul>
                  </div>

                  {/* Payment */}
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Payment Method</h2>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-900 mb-4">
                      This is a demo enrollment flow. In production, this would integrate with Stripe or Flutterwave for payment processing.
                    </div>
                    <Button size="lg" className="w-full" asChild>
                      <a href={`/checkout/${id}`}>Proceed to Payment</a>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                {course.image_url && (
                  <img
                    src={course.image_url}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="font-semibold text-foreground mb-4">{course.title}</h3>
                <div className="space-y-4 py-4 border-y border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                    <p className="font-medium text-foreground">Expert Instructor</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="font-medium text-foreground capitalize">{course.level}</p>
                  </div>
                  {course.duration_weeks && (
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground">{course.duration_weeks} weeks</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
