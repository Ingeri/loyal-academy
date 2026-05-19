import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, Users, TrendingUp, ArrowRight, 
  Sparkles, Award 
} from 'lucide-react';

export default async function InstructorPage() {
  const session = await getSession();
  const userId = session!.userId;

  const [user, courses, enrollments] = await Promise.all([
    prisma.user.findUnique({ 
      where: { id: userId }, 
      select: { name: true } 
    }),
    prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.enrollment.findMany({
      include: { course: true, user: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  const firstName = user?.name?.split(' ')[0] || 'Instructor';

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            You have {courses.length} courses and {enrollments.length} student enrollments.
          </p>
        </div>
        <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/20 transition-all" asChild>
          <Link href="/dashboard/instructor/courses">
            Manage Courses
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Courses" value={courses.length} icon={<BookOpen className="text-blue-500 w-5 h-5"/>} color="bg-blue-500/10" />
        <StatCard label="Students" value={enrollments.length} icon={<Users className="text-amber-500 w-5 h-5"/>} color="bg-amber-500/10" />
        <StatCard label="Active" value={courses.filter(c => c.published).length} icon={<TrendingUp className="text-green-500 w-5 h-5"/>} color="bg-green-500/10" />
        <StatCard label="Certificates" value={0} icon={<Award className="text-purple-500 w-5 h-5"/>} color="bg-purple-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Enrollments</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/instructor/students" className="flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {enrollments.length > 0 ? enrollments.slice(0, 5).map((enrollment) => (
              <Card key={enrollment.id} className="p-4 bg-card/50">
                <div className="flex gap-5 items-center">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{enrollment.course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Student: {enrollment.user.name || enrollment.user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{Math.round(enrollment.progress)}%</div>
                    <div className="text-xs text-muted-foreground">Progress</div>
                  </div>
                </div>
              </Card>
            )) : (
              <Card className="p-12 text-center border-dashed bg-muted/5">
                <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No enrollments yet.</p>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 text-white relative overflow-hidden border-none shadow-xl">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-80 text-xs font-bold uppercase tracking-wider">
                  <TrendingUp className="h-4 w-4" /> Total Students
                </div>
                <div className="text-5xl font-black mb-4">{enrollments.length}</div>
                <p className="text-sm opacity-80">Active learners across all courses</p>
             </div>
             <Users className="absolute -right-6 -bottom-6 h-32 w-32 text-white/5 rotate-12" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className="p-6 flex flex-col gap-3 border-none shadow-sm hover:shadow-md transition-shadow bg-card/60">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</div>
      </div>
    </Card>
  );
}
