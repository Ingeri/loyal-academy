'use client';

import Link from 'next/link';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Clock, CheckCircle, TrendingUp, Award, Calendar, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

const mockEnrollments = [
  {
    id: 'enroll-1',
    courseId: '1',
    courseTitle: 'Web Development Fundamentals',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=500&h=300&fit=crop',
    progress: 75,
    enrollmentDate: '2026-03-15',
    isCompleted: false,
    totalLessons: 11,
    completedLessons: 8,
    estimatedCompletion: '3 weeks',
    description: 'Learn HTML, CSS, and JavaScript from scratch',
  },
  {
    id: 'enroll-2',
    courseId: '4',
    courseTitle: 'UX/UI Design Bootcamp',
    image: 'https://images.pexels.com/photos/3150150/pexels-photo-3150150.jpeg?w=500&h=300&fit=crop',
    progress: 100,
    enrollmentDate: '2026-02-20',
    isCompleted: true,
    totalLessons: 3,
    completedLessons: 3,
    description: 'Learn design principles, Figma, and user research',
  },
  {
    id: 'enroll-3',
    courseId: '2',
    courseTitle: 'Advanced React Patterns',
    image: 'https://images.pexels.com/photos/3583447/pexels-photo-3583447.jpeg?w=500&h=300&fit=crop',
    progress: 45,
    enrollmentDate: '2026-03-28',
    isCompleted: false,
    totalLessons: 2,
    completedLessons: 1,
    estimatedCompletion: '5 weeks',
    description: 'Master advanced React concepts and best practices',
  },
];

const mockCertificates = [
  {
    id: 'cert-1',
    courseId: '4',
    courseTitle: 'UX/UI Design Bootcamp',
    instructor: 'Alex Kim',
    issueDate: '2026-04-08',
    certificateNumber: 'LC-2026-ABC123',
  },
];

const mockWebinars = [
  {
    id: 'webinar-1-1',
    courseId: '1',
    courseTitle: 'Web Development Fundamentals',
    title: 'Building Your First Website',
    date: '2026-04-20',
    time: '2:00 PM UTC',
    instructor: 'Sarah Johnson',
    registered: true,
  },
  {
    id: 'webinar-4-1',
    courseId: '4',
    courseTitle: 'UX/UI Design Bootcamp',
    title: 'Designing User-Centered Interfaces',
    date: '2026-04-25',
    time: '3:30 PM UTC',
    instructor: 'Alex Kim',
    registered: true,
  },
];

function getUserData() {
  return {
    name: 'John Doe',
    email: 'john@example.com',
  };
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const user = getUserData();
  const enrollments = mockEnrollments;
  const certificates = mockCertificates;
  const webinars = mockWebinars;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const stats = {
    enrollments: enrollments.length,
    certificates: certificates.length,
    completed: enrollments.filter(e => e.isCompleted).length,
  };

  const recentEnrollments = enrollments.slice(0, 6);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="border-b bg-card px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name}!</h1>
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
                    href={`/learn/${enrollment.courseId}`}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                      <img
                        src={enrollment.image}
                        alt={enrollment.courseTitle}
                        className="h-40 w-full object-cover"
                      />
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                          {enrollment.courseTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {enrollment.description}
                        </p>
                        {!enrollment.isCompleted && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {enrollment.completedLessons}/{enrollment.totalLessons} lessons complete
                          </p>
                        )}
                        <div className="space-y-2 mt-auto">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold text-foreground">{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          {enrollment.estimatedCompletion && (
                            <p className="text-xs text-muted-foreground">Est. {enrollment.estimatedCompletion}</p>
                          )}
                        </div>
                        {enrollment.isCompleted && (
                          <div className="mt-3 bg-green-100 rounded p-2">
                            <p className="text-xs text-green-800 font-medium">✓ Completed</p>
                          </div>
                        )}
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
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">My Certificates</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certificates.map((cert: any) => (
                  <Link key={cert.id} href={`/certificate/${cert.courseId}`}>
                    <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <Award className="h-8 w-8 text-yellow-500 mb-4" />
                      <p className="text-sm text-muted-foreground">Certificate Earned</p>
                      <p className="font-semibold text-foreground line-clamp-2">
                        {cert.courseTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-3 mb-4">
                        Issued on {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <span>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </span>
                      </Button>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Webinars */}
          {webinars.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Webinars</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {webinars.map((webinar: any) => (
                  <Card key={webinar.id} className="p-6 border-blue-200 bg-blue-50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-blue-600 mb-1">{webinar.courseTitle}</p>
                        <h3 className="text-lg font-semibold text-foreground">{webinar.title}</h3>
                      </div>
                      <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    </div>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">📅 Date:</span> {webinar.date}
                      </p>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">⏰ Time:</span> {webinar.time}
                      </p>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">👨‍🏫 Instructor:</span> {webinar.instructor}
                      </p>
                    </div>
                    {webinar.registered && (
                      <div className="bg-green-100 border border-green-300 rounded p-2 mb-4">
                        <p className="text-sm text-green-800 font-medium">✓ You&apos;re registered</p>
                      </div>
                    )}
                    <Button className="w-full" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Continue Learning */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Continue Learning</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {enrollments.filter((e: any) => !e.isCompleted).map((enrollment: any) => (
                <Link key={enrollment.id} href={`/learn/${enrollment.courseId}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <img
                      src={enrollment.image}
                      alt={enrollment.courseTitle}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">{enrollment.courseTitle}</h3>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{enrollment.progress}% complete</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
