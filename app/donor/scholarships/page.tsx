import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  HandHeart, Plus, ArrowRight, 
  Calendar, DollarSign, Users, 
  ToggleLeft, ToggleRight, Trash2, Edit
} from 'lucide-react';
import { deleteDonorScholarship, toggleScholarshipActive } from '@/lib/actions/donor/scholarships';

export default async function DonorScholarshipsPage() {
  const session = await getSession();
  const userId = session!.userId;

  const scholarships = await prisma.scholarship.findMany({
    where: { donorId: userId },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scholarships</h1>
          <p className="text-muted-foreground mt-2">
            Manage your scholarship programs
          </p>
        </div>
        <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/20 transition-all" asChild>
          <Link href="/donor/scholarships/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Scholarship
          </Link>
        </Button>
      </header>

      {scholarships.length > 0 ? (
        <div className="grid gap-4">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className="p-6 hover:border-primary/50 transition-all bg-card/50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{scholarship.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {scholarship.description}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      scholarship.isActive 
                        ? 'bg-green-500/10 text-green-600' 
                        : 'bg-gray-500/10 text-gray-600'
                    }`}>
                      {scholarship.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>${Number(scholarship.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{scholarship._count.applications} applications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(scholarship.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{scholarship.awardsGranted}/{scholarship.maxAwards} awarded</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <form action={async () => {
                    'use server';
                    await toggleScholarshipActive(scholarship.id, !scholarship.isActive);
                  }}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      type="submit"
                      className="hover:bg-primary/10"
                    >
                      {scholarship.isActive ? (
                        <ToggleRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </form>
                  
                  <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                    <Link href={`/donor/scholarships/${scholarship.slug}`}>
                      <Edit className="h-5 w-5" />
                    </Link>
                  </Button>
                  
                  <form action={async () => {
                    'use server';
                    await deleteDonorScholarship(scholarship.id);
                  }}>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      type="submit"
                      className="hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </form>
                  
                  <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                    <Link href={`/donor/scholarships/${scholarship.slug}`}>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-dashed bg-muted/5">
          <HandHeart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No scholarships yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first scholarship to start supporting students
          </p>
          <Button variant="outline" asChild>
            <Link href="/donor/scholarships/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Scholarship
            </Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
