import { StudentSidebar } from '@/components/student/student-sidebar';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Check session exists
  if (!session) {
    redirect('/auth/login?redirect=/student');
  }

  // Server-side role check - only STUDENT allowed
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  if (!user || user.role !== 'STUDENT') {
    redirect('/auth/login?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 border-r bg-card">
        <StudentSidebar />
      </aside>
      
      <main className="md:pl-64 flex flex-col min-h-screen">
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
