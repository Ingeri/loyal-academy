import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Admin Dashboard - Loyal Academy',
  description: 'Manage your Loyal Academy platform',
};

async function checkAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/admin');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role !== 'admin') {
    redirect('/dashboard');
  }

  return user;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAdminAccess();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar className="hidden md:flex flex-shrink-0" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
