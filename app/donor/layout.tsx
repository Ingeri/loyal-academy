import { PortalSidebar } from '@/components/portal/portal-sidebar';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/auth/login?redirect=/donor');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  if (!user || user.role !== 'DONOR') {
    redirect('/auth/login?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="flex">
        <aside className="hidden md:flex w-64 flex-col border-r bg-card sticky top-20 self-start h-[calc(100vh-5rem)]">
          <PortalSidebar />
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}