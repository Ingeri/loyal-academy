import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Clock, CheckCircle, TrendingUp, Award } from 'lucide-react';

export const metadata = {
  title: 'Dashboard - Loyal Academy',
  description: 'Your learning dashboard',
};

async function getUserData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return user;
}

async function getEnrollments(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('enrollments')
    .select('id, student_id, course_id, enrollment_date, completion_percentage, is_completed, courses(id, title, image_url, description)')
    .eq('student_id', userId)
    .order('enrollment_date', { ascending: false });

  return data || [];
}

async function getCertificates(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('certificates')
    .select('id, enrollment_id, issue_date, enrollments(courses(title))')
    .eq('enrollments.student_id', userId);

  return data || [];
}

async function getStats(userId: string) {
  const supabase = await createClient();
  const [enrollmentsResult, certificatesResult, completedResult] = await Promise.all([
    supabase.from('enrollments').select('id', { count: 'exact' }).eq('student_id', userId),
    supabase
      .from('certificates')
      .select('id', { count: 'exact' })
      .eq('enrollments.student_id', userId),
    supabase
      .from('enrollments')
      .select('id', { count: 'exact' })
      .eq('student_id', userId)
      .eq('is_completed', true),
  ]);

  return {
    enrollments: enrollmentsResult.count || 0,
    certificates: certificatesResult.count || 0,
    completed: completedResult.count || 0,
  };
}

export default async function DashboardPage() {
  const user = await getUserData();
  const enrollments = await getEnrollments(user.id);
  const certificates = await getCertificates(user.id);
  const stats = await getStats(user.id);

  const recentEnrollments = enrollments.slice(0, 6);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b bg-card px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.user_metadata?.full_name || 'Learner'}!</h1>
          <p className="mt-2 text-muted-foreground">Continue your learning journey with Loyal Academy</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Courses Enrolled</p>
                  <p className="text-3xl font-bold text-foreground">{stats.enrollments}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary/20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-foreground">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500/20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                  <p className="text-3xl font-bold text-foreground">{stats.certificates}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500/20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Learning Streak</p>
                  <p className="text-3xl font-bold text-foreground">5 days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500/20" />
              </div>
            </Card>
          </div>

          {/* Enrolled Courses */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
              <Link href="/courses">
                <Button variant="outline">Browse More Courses</Button>
              </Link>
            </div>

            {recentEnrollments.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {recentEnrollments.map((enrollment: any) => (
                  <Link
                    key={enrollment.id}
                    href={`/learn/${enrollment.id}`}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                      {enrollment.courses?.image_url && (
                        <img
                          src={enrollment.courses.image_url}
                          alt={enrollment.courses.title}
                          className="h-40 w-full object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                          {enrollment.courses?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {enrollment.courses?.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold text-foreground">{enrollment.completion_percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.completion_percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground mb-6">You haven&apos;t enrolled in any courses yet.</p>
                <Link href="/courses">
                  <Button>Explore Courses</Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Certificates */}
          {certificates.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">My Certificates</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {certificates.map((cert: any) => (
                  <Card key={cert.id} className="p-6">
                    <Award className="h-8 w-8 text-yellow-500 mb-4" />
                    <p className="text-sm text-muted-foreground">Certificate Earned</p>
                    <p className="font-semibold text-foreground">
                      {cert.enrollments?.courses?.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Issued on {new Date(cert.issue_date).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
