import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { StudentSidebar } from '@/components/student/student-sidebar';
import { InstructorSidebar } from '@/components/instructor/instructor-sidebar';
import { ClientSidebar } from '@/components/client/client-sidebar';
import { PortalSidebar } from '@/components/portal/portal-sidebar';
import { SettingsTabs } from './settings-tabs';

// Dynamic layout wrapper component based on user role
function RoleLayoutWrapper({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const SidebarComponent = {
    ADMIN: AdminSidebar,
    STUDENT: StudentSidebar,
    INSTRUCTOR: InstructorSidebar,
    CLIENT: ClientSidebar,
    DONOR: PortalSidebar,
    CAREER_ADVISOR: PortalSidebar,
  }[role] || StudentSidebar;

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 border-r bg-card">
        <SidebarComponent />
      </aside>
      <main className="md:pl-64 flex flex-col min-h-screen pt-20">
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  return (
    <RoleLayoutWrapper role={session.role}>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your account security, notifications, and preferences.
          </p>
        </div>

        <SettingsTabs />
      </div>
    </RoleLayoutWrapper>
  );
}