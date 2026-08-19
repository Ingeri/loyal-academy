import { ClientSidebar } from '@/components/client/client-sidebar';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Check session exists
  if (!session) {
    redirect('/auth/login?redirect=/client');
  }

  // Server-side role check - only CLIENT allowed
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  if (!user || user.role !== 'CLIENT') {
    redirect('/auth/login?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 border-r bg-card">
        <ClientSidebar />
      </aside>

      <main className="md:pl-64 mt-20 flex flex-col min-h-screen">
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
