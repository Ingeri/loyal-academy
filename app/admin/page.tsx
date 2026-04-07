import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';

async function checkAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role !== 'admin') {
    redirect('/dashboard');
  }

  return user;
}

async function getAdminStats() {
  const supabase = await createClient();

  const [courses, users, enrollments, totalRevenue] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact' }),
    supabase.from('users').select('id', { count: 'exact' }),
    supabase.from('enrollments').select('id', { count: 'exact' }),
    supabase.from('payments').select('amount').eq('status', 'completed'),
  ]);

  const revenue = totalRevenue.data?.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) || 0;

  return {
    courses: courses.count || 0,
    users: users.count || 0,
    enrollments: enrollments.count || 0,
    revenue,
  };
}

export default async function AdminPage() {
  await checkAdminAccess();
  const stats = await getAdminStats();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b bg-card px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Manage your Loyal Academy platform</p>
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
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-3xl font-bold text-foreground">{stats.courses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary/20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-foreground">{stats.users}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500/20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Enrollments</p>
                  <p className="text-3xl font-bold text-foreground">{stats.enrollments}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500/20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-foreground">${stats.revenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500/20" />
              </div>
            </Card>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Courses Management */}
            <Card className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Manage Courses</h2>
                  <p className="text-muted-foreground mt-2">Create, edit, and manage your courses</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <Link href="/admin/courses">
                  <Button variant="outline" className="w-full">
                    View All Courses
                  </Button>
                </Link>
                <Link href="/admin/courses/new">
                  <Button className="w-full">Create New Course</Button>
                </Link>
              </div>
            </Card>

            {/* Users Management */}
            <Card className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Manage Users</h2>
                  <p className="text-muted-foreground mt-2">View and manage user accounts and roles</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <Link href="/admin/users">
                  <Button variant="outline" className="w-full">
                    View All Users
                  </Button>
                </Link>
                <Link href="/admin/instructors">
                  <Button variant="outline" className="w-full">
                    Manage Instructors
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Analytics */}
            <Card className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
                  <p className="text-muted-foreground mt-2">View platform analytics and insights</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <Link href="/admin/analytics">
                  <Button variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </Link>
                <Link href="/admin/reports">
                  <Button variant="outline" className="w-full">
                    Generate Reports
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Payments */}
            <Card className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Payments & Revenue</h2>
                  <p className="text-muted-foreground mt-2">Manage payments and revenue tracking</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <Link href="/admin/payments">
                  <Button variant="outline" className="w-full">
                    View Payments
                  </Button>
                </Link>
                <Link href="/admin/payouts">
                  <Button variant="outline" className="w-full">
                    Manage Payouts
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
