import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react'

export default async function InstructorPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login?redirect=/instructor')
  }

  const userId = session.userId

  const [user, courses, enrollments, certificates] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    }),

    prisma.course.findMany({
      where: { instructorId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),

    prisma.enrollment.findMany({
      where: {
        course: {
          instructorId: userId,
        },
      },
      include: {
        course: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),

    prisma.certificate.count({
      where: {
        course: {
          instructorId: userId,
        },
      },
    }),
  ])

  const firstName = user?.name?.split(' ')[0] || 'Instructor'

  const publishedCourses = courses.filter(
    (course: (typeof courses)[number]) => course.published
  ).length

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome, {firstName}!
          </h1>

          <p className="mt-2 text-lg text-muted-foreground">
            You have {courses.length} courses and {enrollments.length} student
            enrollments.
          </p>
        </div>

        <Button
          size="lg"
          asChild
          className="rounded-full shadow-lg transition-all hover:shadow-primary/20"
        >
          <Link href="/instructor/courses">Manage Courses</Link>
        </Button>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Courses"
          value={courses.length}
          icon={<BookOpen className="h-5 w-5 text-blue-500" />}
          color="bg-blue-500/10"
        />

        <StatCard
          label="Students"
          value={enrollments.length}
          icon={<Users className="h-5 w-5 text-amber-500" />}
          color="bg-amber-500/10"
        />

        <StatCard
          label="Published"
          value={publishedCourses}
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          color="bg-green-500/10"
        />

        <StatCard
          label="Certificates"
          value={certificates}
          icon={<Award className="h-5 w-5 text-purple-500" />}
          color="bg-purple-500/10"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* RECENT ENROLLMENTS HEADER */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Enrollments</h2>

            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/instructor/students"
                className="flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* RECENT ENROLLMENTS */}
          <div className="grid gap-4">
            {enrollments.length > 0 ? (
              enrollments
                .slice(0, 5)
                .map((enrollment: (typeof enrollments)[number]) => (
                  <Card
                    key={enrollment.id}
                    className="bg-card/50 p-4"
                  >
                    <div className="flex items-center gap-5">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold">
                          {enrollment.course.title}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Student:{' '}
                          {enrollment.user.name ||
                            enrollment.user.email ||
                            'Unknown student'}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {Math.round(Number(enrollment.progress || 0))}%
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Progress
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            ) : (
              <Card className="border-dashed bg-muted/5 p-12 text-center">
                <Sparkles className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

                <p className="text-muted-foreground">
                  No enrollments yet.
                </p>
              </Card>
            )}
          </div>

          {/* COURSES HEADER */}
          <div className="flex items-center justify-between pt-4">
            <h2 className="text-2xl font-bold">Your Courses</h2>

            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/instructor/courses"
                className="flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* COURSES */}
          <div className="grid gap-4">
            {courses.length > 0 ? (
              courses.map((course: (typeof courses)[number]) => (
                <Card
                  key={course.id}
                  className="bg-card/50 p-4"
                >
                  <div className="flex items-center gap-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-bold">
                          {course.title}
                        </h3>

                        {course.published && (
                          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                            Published
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {course.studentNumber || 0} students enrolled
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium">
                        ${Number(course.price || 0).toFixed(2)}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Price
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="border-dashed bg-muted/5 p-12 text-center">
                <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />

                <p className="text-muted-foreground">
                  No courses yet.
                </p>

                <Button className="mt-4" asChild>
                  <Link href="/instructor/courses/new">
                    Create your first course
                  </Link>
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* STUDENTS CARD */}
          <Card className="relative overflow-hidden border-none bg-slate-900 p-6 text-white shadow-xl">
            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
                <TrendingUp className="h-4 w-4" />
                Total Students
              </div>

              <div className="mb-4 text-5xl font-black">
                {enrollments.length}
              </div>

              <p className="text-sm opacity-80">
                Active learners across all courses
              </p>
            </div>

            <Users className="absolute -bottom-6 -right-6 h-32 w-32 rotate-12 text-white/5" />
          </Card>

          {/* CERTIFICATES CARD */}
          <Card className="relative overflow-hidden border-none bg-linear-to-br from-purple-600 to-indigo-600 p-6 text-white shadow-xl">
            <div className="relative z-10">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
                <Award className="h-4 w-4" />
                Certificates Issued
              </div>

              <div className="mb-4 text-5xl font-black">
                {certificates}
              </div>

              <p className="text-sm opacity-80">
                Students who completed your courses
              </p>
            </div>

            <Award className="absolute -bottom-6 -right-6 h-32 w-32 rotate-12 text-white/5" />
          </Card>
        </div>
      </div>
    </div>
  )
}

type StatCardProps = {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}

function StatCard({
  label,
  value,
  icon,
  color,
}: StatCardProps) {
  return (
    <Card className="flex flex-col gap-3 border-none bg-card/60 p-6 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-inner ${color}`}
      >
        {icon}
      </div>

      <div>
        <div className="text-2xl font-bold tracking-tight">
          {value}
        </div>

        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </div>
      </div>
    </Card>
  )
}