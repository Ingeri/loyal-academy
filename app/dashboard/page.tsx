'use client';

import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BookOpen,
  CheckCircle,
  Award,
  TrendingUp,
  Clock,
  PlayCircle,
  FileText,
  ArrowRight,
  Download,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Enrollment {
  id: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    thumbnail: string | null;
    description: string | null;
    slug: string;
  };
  progress: number;
  createdAt: string;
  isCompleted?: boolean;
  completedLessons?: number;
  totalLessons?: number;
}

interface Certificate {
  id: string;
  courseId: string;
  course: {
    title: string;
    thumbnail: string | null;
  };
  issueDate: string;
  certificateNumber: string;
  grade: string;
}

interface DashboardData {
  enrollments: Enrollment[];
  certificates: Certificate[];
  stats: {
    totalEnrollments: number;
    completedCourses: number;
    certificates: number;
    averageProgress: number;
  };
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const enrollmentsRes = await fetch('/api/enrollments');
      if (!enrollmentsRes.ok) {
        if (enrollmentsRes.status === 401) {
          setError('Please sign in to view your dashboard');
          return;
        }
        throw new Error('Failed to fetch enrollments');
      }
      const enrollments = await enrollmentsRes.json();

      const certificatesRes = await fetch('/api/certificates');
      let certificates: Certificate[] = [];
      if (certificatesRes.ok) {
        certificates = await certificatesRes.json();
      }

      const completedCourses = enrollments.filter((e: Enrollment) => e.progress === 100).length;
      const totalProgress = enrollments.reduce((sum: number, e: Enrollment) => sum + (e.progress || 0), 0);
      const averageProgress = enrollments.length > 0 ? Math.round(totalProgress / enrollments.length) : 0;

      setData({
        enrollments: enrollments.map((e: Enrollment) => ({
          ...e,
          isCompleted: e.progress === 100,
          completedLessons: Math.round((e.progress / 100) * (e.course?.totalLessons || 10)),
          totalLessons: e.course?.totalLessons || 10,
        })),
        certificates,
        stats: {
          totalEnrollments: enrollments.length,
          completedCourses,
          certificates: certificates.length,
          averageProgress,
        },
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (!mounted) return null;

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Unable to Load Dashboard</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  const inProgressCourses = data?.enrollments.filter(e => !e.isCompleted) || [];
  const completedCourses = data?.enrollments.filter(e => e.isCompleted) || [];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-background" />
        <div className="absolute inset-0 opacity-50" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />

        <div className="relative px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{getGreeting()}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Your Learning Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground max-w-xl">
                  Track your progress, manage your courses, and celebrate your achievements
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  {data?.stats.averageProgress || 0}% Average Progress
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 -mt-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </Card>
                ))}
              </>
            ) : (
              <>
                <StatCard
                  icon={<BookOpen className="h-5 w-5 text-primary" />}
                  label="Courses Enrolled"
                  value={data?.stats.totalEnrollments || 0}
                  trend="Active learning"
                />
                <StatCard
                  icon={<PlayCircle className="h-5 w-5 text-amber-500" />}
                  label="In Progress"
                  value={inProgressCourses.length}
                  trend="Keep going!"
                />
                <StatCard
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  label="Completed"
                  value={data?.stats.completedCourses || 0}
                  trend="Great job!"
                />
                <StatCard
                  icon={<Award className="h-5 w-5 text-yellow-500" />}
                  label="Certificates"
                  value={data?.stats.certificates || 0}
                  trend="Achievements"
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column - Courses */}
            <div className="lg:col-span-2 space-y-8">

              {/* Continue Learning */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    Continue Learning
                  </h2>
                  {inProgressCourses.length > 0 && (
                    <Link href="/courses" className="text-sm text-primary hover:underline flex items-center gap-1">
                      Browse more <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <Card key={i} className="p-6">
                        <div className="flex gap-4">
                          <Skeleton className="h-20 w-32 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-2 w-full" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : inProgressCourses.length > 0 ? (
                  <div className="space-y-4">
                    {inProgressCourses.slice(0, 3).map((enrollment) => (
                      <Link key={enrollment.id} href={`/learn/${enrollment.course.slug}`}>
                        <Card className="p-4 hover:shadow-md transition-all cursor-pointer group">
                          <div className="flex gap-4">
                            <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              {enrollment.course.thumbnail ? (
                                <img
                                  src={enrollment.course.thumbnail}
                                  alt={enrollment.course.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                                  <BookOpen className="h-6 w-6 text-primary/50" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <PlayCircle className="h-5 w-5 text-primary" />
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {enrollment.course.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {enrollment.course.description || 'Continue your learning journey'}
                              </p>
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                  <span className="text-muted-foreground">
                                    {Math.round(enrollment.progress)}% complete
                                  </span>
                                  <span className="text-primary font-medium">
                                    {enrollment.completedLessons}/{enrollment.totalLessons} lessons
                                  </span>
                                </div>
                                <Progress value={enrollment.progress} className="h-1.5" />
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-primary/60" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Start Your Journey</h3>
                    <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                      You have not enrolled in any courses yet. Explore our catalog to begin learning.
                    </p>
                    <Button asChild>
                      <Link href="/courses">Explore Courses</Link>
                    </Button>
                  </Card>
                )}
              </div>

              {/* Completed Courses */}
              {completedCourses.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Completed
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {completedCourses.slice(0, 4).map((enrollment) => (
                      <Link key={enrollment.id} href={`/learn/${enrollment.course.slug}`}>
                        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex gap-3">
                            <div className="h-14 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              {enrollment.course.thumbnail ? (
                                <img
                                  src={enrollment.course.thumbnail}
                                  alt={enrollment.course.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50">
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{enrollment.course.title}</h3>
                              <Badge variant="secondary" className="mt-1.5 text-xs bg-green-100 text-green-700 border-0">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Certificates & Quick Actions */}
            <div className="space-y-8">

              {/* Certificates */}
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Certificates
                </h2>

                {loading ? (
                  <Card className="p-6">
                    <Skeleton className="h-16 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4" />
                  </Card>
                ) : data?.certificates && data.certificates.length > 0 ? (
                  <div className="space-y-3">
                    {data.certificates.slice(0, 3).map((cert) => (
                      <Card key={cert.id} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-amber-50 flex items-center justify-center flex-shrink-0">
                            <Award className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{cert.course.title}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(cert.issueDate).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">{cert.grade}</Badge>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="h-6 w-6 text-yellow-400" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complete courses to earn certificates
                    </p>
                  </Card>
                )}
              </div>

              {/* Quick Stats */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Learning Activity
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-medium">{data?.stats.averageProgress || 0}%</span>
                    </div>
                    <Progress value={data?.stats.averageProgress || 0} className="h-2" />
                  </div>
                  <div className="pt-2 border-t border-primary/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Lessons</span>
                      <span className="font-medium">
                        {data?.enrollments.reduce((sum, e) => sum + (e.completedLessons || 0), 0) || 0}
                      </span>
                    </div>
                  </div>
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

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: number; trend: string }) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="p-2 bg-muted rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{trend}</p>
      </div>
    </Card>
  );
}

