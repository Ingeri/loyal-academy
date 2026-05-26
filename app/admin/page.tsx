import { prisma } from '@/lib/prisma';
import { checkAdminAccess } from '@/lib/actions/admin';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, BookOpen, TrendingUp, Plus, ArrowRight, Award, Clock, PenTool, DollarSign, Briefcase, Handshake, FileText } from 'lucide-react';

async function getAdminStats() {
  const [courses, users, enrollments, blogs, blogCategories, scholarships, projects, partnerships, certificates, activeStudents, pendingScholarshipApplications, pendingProjectApplications] = await Promise.all([
    prisma.course.count(),
    prisma.user.count(),
    prisma.enrollment.count(),
    prisma.blog.count(),
    prisma.blogCategory.count(),
    prisma.scholarship.count(),
    prisma.project.count(),
    prisma.partnership.count(),
    prisma.certificate.count(),
    prisma.enrollment.count({ where: { progress: { gt: 0 } } }),
    prisma.scholarshipApplication.count({ where: { status: 'PENDING' } }),
    prisma.projectApplication.count({ where: { status: 'PENDING' } }),
  ]);

  const usersByRole = await prisma.user.groupBy({
    by: ['role'],
    _count: true,
  });

  return {
    courses,
    users,
    enrollments,
    blogs,
    blogCategories,
    scholarships,
    projects,
    partnerships,
    certificates,
    activeStudents,
    usersByRole,
    pendingScholarshipApplications,
    pendingProjectApplications,
  };
}

async function getRecentActivity() {
  const [recentEnrollments, recentBlogs, recentScholarships] = await Promise.all([
    prisma.enrollment.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
      },
    }),
    prisma.blog.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        title: true,
        authorName: true,
        createdAt: true,
      },
    }),
    prisma.scholarshipApplication.findMany({
      take: 3,
      orderBy: { submittedAt: 'desc' },
      include: {
        applicant: { select: { name: true } },
        scholarship: { select: { title: true } },
      },
    }),
  ]);

  return {
    recentEnrollments,
    recentBlogs,
    recentScholarships,
  };
}

export default async function AdminPage() {
  await checkAdminAccess();
  const stats = await getAdminStats();
  const activity = await getRecentActivity();

  const getRoleCount = (role: string) => {
    return stats.usersByRole.find((r) => r.role === role)?._count || 0;
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
        <p className='mt-1 text-muted-foreground'>Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Platform Overview Stats */}
      <div>
        <h2 className='text-lg font-semibold text-foreground mb-4'>Platform Overview</h2>
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
            <div className='absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-colors' />
            <div className='flex items-center justify-between relative z-10'>
              <div>
                <p className='text-sm text-muted-foreground'>Active Students</p>
                <p className='text-3xl font-bold text-foreground mt-1'>{stats.activeStudents}</p>
              </div>
              <div className='h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center'>
                <Award className='h-6 w-6 text-amber-500' />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Content Stats */}
      <div>
        <h2 className='text-lg font-semibold text-foreground mb-4'>Content</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-colors' />
            <div className='flex items-center justify-between relative z-10'>
              <div>
                <p className='text-sm text-muted-foreground'>Blogs</p>
                <p className='text-3xl font-bold text-foreground mt-1'>{stats.blogs}</p>
              </div>
              <div className='h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center'>
                <PenTool className='h-6 w-6 text-indigo-500' />
              </div>
            </div>
          </Card>

          <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-pink-500/20 transition-colors' />
            <div className='flex items-center justify-between relative z-10'>
              <div>
                <p className='text-sm text-muted-foreground'>Blog Categories</p>
                <p className='text-3xl font-bold text-foreground mt-1'>{stats.blogCategories}</p>
              </div>
              <div className='h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center'>
                <FileText className='h-6 w-6 text-pink-500' />
              </div>
            </div>
          </Card>

          <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors' />
            <div className='flex items-center justify-between relative z-10'>
              <div>
                <p className='text-sm text-muted-foreground'>Scholarships</p>
                <p className='text-3xl font-bold text-foreground mt-1'>{stats.scholarships}</p>
              </div>
              <div className='h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center'>
                <DollarSign className='h-6 w-6 text-emerald-500' />
              </div>
            </div>
          </Card>

          <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors' />
            <div className='flex items-center justify-between relative z-10'>
              <div>
                <p className='text-sm text-muted-foreground'>Projects</p>
                <p className='text-3xl font-bold text-foreground mt-1'>{stats.projects}</p>
              </div>
              <div className='h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center'>
                <Briefcase className='h-6 w-6 text-cyan-500' />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Engagement Stats */}
      <div>
        <h2 className='text-lg font-semibold text-foreground mb-4'>Engagement</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-colors' />
            <div className='flex items-center justify-between relative z-10'>
              <div>
                <p className='text-sm text-muted-foreground'>Partnerships</p>
                <p className='text-3xl font-bold text-foreground mt-1'>{stats.partnerships}</p>
              </div>
              <div className='h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center'>
                <Handshake className='h-6 w-6 text-orange-500' />
              </div>
            </div>
          </Card>

          <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/20 transition-colors' />
            <div className='flex items-center justify-between relative z-10'>
              <div>
                <p className='text-sm text-muted-foreground'>Certificates</p>
                <p className='text-3xl font-bold text-foreground mt-1'>{stats.certificates}</p>
              </div>
              <div className='h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center'>
                <Award className='h-6 w-6 text-violet-500' />
              </div>
            </div>
          </Card>

          <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/20 transition-colors' />
            <div className='flex items-center justify-between relative z-10'>
              <div>
                <p className='text-sm text-muted-foreground'>Students</p>
                <p className='text-3xl font-bold text-foreground mt-1'>{getRoleCount('STUDENT')}</p>
              </div>
              <div className='h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center'>
                <Users className='h-6 w-6 text-rose-500' />
              </div>
            </div>
          </Card>

          <Card className='p-6 relative overflow-hidden group hover:shadow-lg transition-shadow'>
            <div className='absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-sky-500/20 transition-colors' />
            <div className='flex items-center justify-between relative z-10'>
              <div>
                <p className='text-sm text-muted-foreground'>Instructors</p>
                <p className='text-3xl font-bold text-foreground mt-1'>{getRoleCount('INSTRUCTOR')}</p>
              </div>
              <div className='h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center'>
                <BookOpen className='h-6 w-6 text-sky-500' />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Pending Applications */}
      <div>
        <h2 className='text-lg font-semibold text-foreground mb-4'>Pending Applications</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Link href='/admin/scholarships'>
            <Card className='p-6 hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-emerald-500'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Scholarship Applications</p>
                  <p className='text-3xl font-bold text-foreground mt-1'>{stats.pendingScholarshipApplications}</p>
                </div>
                <div className='h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors'>
                  <DollarSign className='h-6 w-6 text-emerald-500' />
                </div>
              </div>
            </Card>
          </Link>

          <Link href='/admin/projects'>
            <Card className='p-6 hover:shadow-md transition-shadow cursor-pointer group border-l-4 border-l-cyan-500'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground'>Project Applications</p>
                  <p className='text-3xl font-bold text-foreground mt-1'>{stats.pendingProjectApplications}</p>
                </div>
                <div className='h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors'>
                  <Briefcase className='h-6 w-6 text-cyan-500' />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Quick Actions */}
        <Card className='p-6 lg:col-span-2'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-foreground'>Quick Actions</h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Link href='/admin/blogs/new'>
              <Card className='p-6 hover:shadow-md transition-shadow cursor-pointer group border-dashed border-2 hover:border-primary/50'>
                <div className='flex items-start gap-4'>
                  <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                    <Plus className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-medium text-foreground'>Create Blog</h3>
                    <p className='text-sm text-muted-foreground mt-1'>Add a new blog post</p>
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
                    <p className='text-sm text-muted-foreground mt-1'>View and manage accounts</p>
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
                    <p className='text-sm text-muted-foreground mt-1'>Generate certificates</p>
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
                    <p className='text-sm text-muted-foreground mt-1'>View performance metrics</p>
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
          </div>
          <div className='space-y-4'>
            {activity.recentEnrollments.length > 0 ? (
              activity.recentEnrollments.map((enrollment: any, index: number) => (
                <div key={index} className='flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0'>
                  <div className='h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0'>
                    <Users className='h-4 w-4 text-blue-500' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-foreground truncate'>
                      {enrollment.user?.name || 'User'}
                    </p>
                    <p className='text-xs text-muted-foreground truncate'>
                      enrolled in {enrollment.course?.title || 'a course'}
                    </p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {new Date(enrollment.createdAt).toLocaleDateString()}
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
