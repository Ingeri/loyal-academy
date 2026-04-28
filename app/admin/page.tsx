import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, BookOpen, DollarSign, TrendingUp, Plus, ArrowRight, Award, Clock } from 'lucide-react';

async function getAdminStats() {
  const supabase = await createClient();

  const [courses, users, enrollments, totalRevenue, activeStudents] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact' }),
    supabase.from('users').select('id', { count: 'exact' }),
    supabase.from('enrollments').select('id', { count: 'exact' }),
    supabase.from('payments').select('amount').eq('status', 'completed'),
    supabase.from('enrollments').select('student_id', { count: 'exact', head: true }).gte('completion_percentage', 1),
  ]);

  const revenue = totalRevenue.data?.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) || 0;

  return {
    courses: courses.count || 0,
    users: users.count || 0,
    enrollments: enrollments.count || 0,
    revenue,
    activeStudents: activeStudents.count || 0,
  };
}

async function getRecentActivity() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('enrollments')
    .select('*, student:student_id(full_name), course:course_id(title)')
    .order('enrollment_date', { ascending: false })
    .limit(5);
  return data || [];
}

export default async function AdminPage() {
  const stats = await getAdminStats();
  const recentActivity = await getRecentActivity();

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
        <p className='mt-1 text-muted-foreground'>Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid - Glassmorphism Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors' />
          <div className='flex items-center justify-between relative z-10'>
            <div>
              <p className='text-sm text-muted-foreground'>Total Courses</p>
              <p className='text-3xl font-bold text-foreground mt-1'>{stats.courses}</p>
            </div>
            <div className='h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center'>
              <BookOpen className='h-6 w-6 text-blue-500' />
            </div>
          </div>
        </Card>

        <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/20 transition-colors' />
          <div className='flex items-center justify-between relative z-10'>
            <div>
              <p className='text-sm text-muted-foreground'>Total Users</p>
              <p className='text-3xl font-bold text-foreground mt-1'>{stats.users}</p>
            </div>
            <div className='h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center'>
              <Users className='h-6 w-6 text-green-500' />
            </div>
          </div>
        </Card>

        <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors' />
          <div className='flex items-center justify-between relative z-10'>
            <div>
              <p className='text-sm text-muted-foreground'>Enrollments</p>
              <p className='text-3xl font-bold text-foreground mt-1'>{stats.enrollments}</p>
            </div>
            <div className='h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center'>
              <TrendingUp className='h-6 w-6 text-purple-500' />
            </div>
          </div>
        </Card>

        <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
          <div className='absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/20 transition-colors' />
          <div className='flex items-center justify-between relative z-10'>
            <div>
              <p className='text-sm text-muted-foreground'>Revenue</p>
              <p className='text-3xl font-bold text-foreground mt-1'></p>
            </div>
            <div className='h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center'>
              <DollarSign className='h-6 w-6 text-yellow-500' />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Quick Actions */}
        <Card className='p-6 lg:col-span-2'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-foreground'>Quick Actions</h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Link href='/admin/courses/new'>
              <Card className='p-6 hover:shadow-md transition-shadow cursor-pointer group border-dashed border-2 hover:border-primary/50'>
                <div className='flex items-start gap-4'>
                  <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                    <Plus className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-medium text-foreground'>Create Course</h3>
                    <p className='text-sm text-muted-foreground mt-1'>Add a new course to your platform</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href='/admin/users'>
              <Card className='p-6 hover:shadow-md transition-shadow cursor-pointer group'>
                <div className='flex items-start gap-4'>
                  <div className='h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors'>
                    <Users className='h-5 w-5 text-blue-500' />
                  </div>
                  <div>
                    <h3 className='font-medium text-foreground'>Manage Users</h3>
                    <p className='text-sm text-muted-foreground mt-1'>View and manage student accounts</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href='/admin/certificates'>
              <Card className='p-6 hover:shadow-md transition-shadow cursor-pointer group'>
                <div className='flex items-start gap-4'>
                  <div className='h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors'>
                    <Award className='h-5 w-5 text-amber-500' />
                  </div>
                  <div>
                    <h3 className='font-medium text-foreground'>Certificates</h3>
                    <p className='text-sm text-muted-foreground mt-1'>Generate and manage certificates</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href='/admin/analytics'>
              <Card className='p-6 hover:shadow-md transition-shadow cursor-pointer group'>
                <div className='flex items-start gap-4'>
                  <div className='h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors'>
                    <BarChart3 className='h-5 w-5 text-purple-500' />
                  </div>
                  <div>
                    <h3 className='font-medium text-foreground'>Analytics</h3>
                    <p className='text-sm text-muted-foreground mt-1'>View platform performance metrics</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-foreground'>Recent Activity</h2>
            <Link href='/admin/enrollments'>
              <Button variant='ghost' size='sm' className='gap-1'>
                View All <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          </div>
          <div className='space-y-4'>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity: any, index: number) => (
                <div key={index} className='flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0'>
                  <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
                    <Users className='h-4 w-4 text-primary' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-foreground truncate'>
                      {activity.student?.full_name || 'New Student'}
                    </p>
                    <p className='text-xs text-muted-foreground truncate'>
                      enrolled in {activity.course?.title || 'a course'}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {new Date(activity.enrollment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-8'>
                <Clock className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                <p className='text-sm text-muted-foreground'>No recent activity</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

