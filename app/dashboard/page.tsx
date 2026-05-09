import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { cn } from "@/lib/utils"; // Fixed: Added this import
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, CheckCircle, Award, PlayCircle, 
  ArrowRight, Download, Sparkles, TrendingUp 
} from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session!.userId;

  const [dbUser, enrollments, certificates] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
    prisma.enrollment.findMany({
      where: { userId },
      include: { 
        course: { include: { syllabus: { include: { lessons: true } } } } 
      },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.certificate.findMany({ where: { userId }, include: { course: true } })
  ]);

  const firstName = dbUser?.name?.split(' ')[0] || 'Learner';
  const completed = enrollments.filter(e => e.progress >= 100);
  const active = enrollments.filter(e => e.progress < 100);
  const avgProgress = enrollments.length > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) 
    : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome, {firstName}!</h1>
          <p className="text-muted-foreground mt-2 text-lg">You have {active.length} courses in progress.</p>
        </div>
        <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/20 transition-all" asChild>
          <Link href="/courses">Browse Catalog</Link>
        </Button>
      </header>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Enrolled" value={enrollments.length} icon={<BookOpen className="text-blue-500 w-5 h-5"/>} color="bg-blue-500/10" />
        <StatCard label="Active" value={active.length} icon={<PlayCircle className="text-amber-500 w-5 h-5"/>} color="bg-amber-500/10" />
        <StatCard label="Finished" value={completed.length} icon={<CheckCircle className="text-green-500 w-5 h-5"/>} color="bg-green-500/10" />
        <StatCard label="Badges" value={certificates.length} icon={<Award className="text-purple-500 w-5 h-5"/>} color="bg-purple-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Continue Learning</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/courses" className="flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {active.length > 0 ? active.map((e) => (
              <Link key={e.id} href={`/learn/${e.course.slug}`}>
                <Card className="p-4 hover:border-primary/50 hover:shadow-md transition-all group bg-card/50">
                  <div className="flex gap-5 items-center">
                    <div className="w-20 h-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden relative">
                      {e.course.thumbnail && <img src={e.course.thumbnail} className="object-cover w-full h-full" alt="" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate group-hover:text-primary transition-colors">{e.course.title}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <Progress value={e.progress} className="h-1.5" />
                        <span className="text-xs font-medium text-muted-foreground">{Math.round(e.progress)}%</span>
                      </div>
                    </div>
                    <PlayCircle className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-all group-hover:scale-110" />
                  </div>
                </Card>
              </Link>
            )) : (
              <Card className="p-12 text-center border-dashed bg-muted/5">
                <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Ready for a new challenge?</p>
                <Button variant="outline" className="mt-4" asChild><Link href="/courses">Explore Library</Link></Button>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar: Overall Mastery & Certificates */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 text-white relative overflow-hidden border-none shadow-xl">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-80 text-xs font-bold uppercase tracking-wider">
                  <TrendingUp className="h-4 w-4" /> Mastery Level
                </div>
                <div className="text-5xl font-black mb-4">{avgProgress}%</div>
                <Progress value={avgProgress} className="h-2 bg-slate-700" />
             </div>
             <Award className="absolute -right-6 -bottom-6 h-32 w-32 text-white/5 rotate-12" />
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" /> Recent Certificates
            </h3>
            <div className="space-y-3">
              {certificates.length > 0 ? certificates.slice(0, 3).map(cert => (
                <div key={cert.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-muted">
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{cert.course.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{new Date(cert.issueDate).toLocaleDateString()}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-primary"><Download className="h-4 w-4"/></Button>
                </div>
              )) : (
                <p className="text-xs text-muted-foreground text-center py-4 italic">Complete a course to earn your first certificate!</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className="p-6 flex flex-col gap-3 border-none shadow-sm hover:shadow-md transition-shadow bg-card/60">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-inner", color)}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</div>
      </div>
    </Card>
  );
}