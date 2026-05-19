import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, TrendingUp, ArrowRight, 
  Sparkles, CheckCircle 
} from 'lucide-react';

export default async function ClientPage() {
  const session = await getSession();
  const userId = session!.userId;

  const [user, projects] = await Promise.all([
    prisma.user.findUnique({ 
      where: { id: userId }, 
      select: { name: true } 
    }),
    prisma.project.findMany({
      where: { companyId: userId },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const firstName = user?.name?.split(' ')[0] || 'Partner';

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            You have {projects.length} project{projects.length !== 1 ? 's' : ''} posted.
          </p>
        </div>
        <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/20 transition-all" asChild>
          <Link href="/client/projects">
            Manage Projects
          </Link>
        </Button>
      </header>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Projects" value={projects.length} icon={<Users className="text-blue-500 w-5 h-5"/>} color="bg-blue-500/10" />
        <StatCard label="Active" value={projects.filter(p => p.status === 'OPEN').length} icon={<TrendingUp className="text-amber-500 w-5 h-5"/>} color="bg-amber-500/10" />
        <StatCard label="Completed" value={projects.filter(p => p.status === 'COMPLETED').length} icon={<CheckCircle className="text-green-500 w-5 h-5"/>} color="bg-green-500/10" />
        <StatCard label="Impact" value={0} icon={<Sparkles className="text-purple-500 w-5 h-5"/>} color="bg-purple-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/client/projects" className="flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {projects.length > 0 ? (
              projects.slice(0, 5).map((project) => (
                <Link key={project.id} href={`/client/projects/${project.slug}`}>
                  <Card className="p-4 hover:border-primary/50 hover:shadow-md transition-all group bg-card/50">
                    <div className="flex gap-5 items-center">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate group-hover:text-primary transition-colors">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Budget: ${Number(project.budget).toLocaleString()}
                        </p>
                      </div>
                      <ArrowRight className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-all" />
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-12 text-center border-dashed bg-muted/5">
                <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No projects posted yet.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/client/projects">Post Project</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 text-white relative overflow-hidden border-none shadow-xl">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-80 text-xs font-bold uppercase tracking-wider">
                  <TrendingUp className="h-4 w-4" /> Total Budget
                </div>
                <div className="text-5xl font-black mb-4">
                  ${projects.reduce((sum, p) => sum + Number(p.budget), 0).toLocaleString()}
                </div>
                <p className="text-sm opacity-80">Total project budget</p>
             </div>
             <Sparkles className="absolute -right-6 -bottom-6 h-32 w-32 text-white/5 rotate-12" />
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
