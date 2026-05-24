import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, PlayCircle, CheckCircle, Search } from 'lucide-react';

export default async function CoursesPage() {
  const session = await getSession();
  const userId = session!.userId;

  // 1. Fetch all enrollments with the course relation
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: true,
    },
    // Fix: Using createdAt as a safe fallback if updatedAt sync is pending
    orderBy: { createdAt: 'desc' } 
  });

  // 2. Categorize data safely (checking that course exists to satisfy TypeScript)
  const active = enrollments.filter(e => e.course && e.progress < 100);
  const completed = enrollments.filter(e => e.course && e.progress >= 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Learning Library</h1>
          <p className="text-muted-foreground">Manage and track your educational journey.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/courses">Explore More Courses</Link>
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-3 bg-muted/50 p-1 mb-8">
          <TabsTrigger value="active" className="rounded-md">Active</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-md">Completed</TabsTrigger>
          <TabsTrigger value="all" className="rounded-md">All</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {active.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map((e) => (
                <CourseCard key={e.id} enrollment={e} />
              ))}
            </div>
          ) : <EmptyState message="No active courses. Ready to start something new?" />}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completed.map((e) => (
                <CourseCard key={e.id} enrollment={e} />
              ))}
            </div>
          ) : <EmptyState message="You haven't finished any courses yet. Keep pushing!" />}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((e) => (
              e.course && <CourseCard key={e.id} enrollment={e} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Sub-component for the Course Cards
function CourseCard({ enrollment }: { enrollment: any }) {
  const { course, progress } = enrollment;

  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 border-muted/60">
      <div className="aspect-video relative overflow-hidden bg-muted">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}
        <div className="absolute top-2 right-2">
            <div className={cn(
                "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                progress >= 100 ? "bg-green-500/20 text-green-600" : "bg-blue-500/20 text-blue-600"
            )}>
                {progress >= 100 ? 'Completed' : 'In Progress'}
            </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Course Progress</span>
            <span className="text-xs font-bold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          
          <Button className="w-full mt-5 rounded-xl group-hover:bg-primary transition-all" variant={progress >= 100 ? "outline" : "default"} asChild>
            <Link href={`/learn/${course.slug}`}>
              {progress >= 100 ? <CheckCircle className="mr-2 h-4 w-4" /> : <PlayCircle className="mr-2 h-4 w-4" />}
              {progress >= 100 ? 'Review Course' : 'Continue Learning'}
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-muted/5">
      <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  );
}