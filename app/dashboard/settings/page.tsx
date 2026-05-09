import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { SettingsForm } from './settings-form';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      role: true,
    }
  });

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account details and preferences.</p>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="space-y-1">
          <p className="font-bold text-sm">Profile Details</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This information will be displayed on your public profile and certificates.
          </p>
        </aside>
        <div className="md:col-span-2">
          <SettingsForm user={user} />
        </div>
      </div>
    </div>
  );
}