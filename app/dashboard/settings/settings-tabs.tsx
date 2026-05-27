'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurityForm } from './security-form';
import { PreferencesForm } from './preferences-form';
import { DangerZone } from './danger-zone';
import { Shield, Bell, AlertTriangle } from 'lucide-react';

export function SettingsTabs() {
  return (
    <Tabs defaultValue="security" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="security" className="gap-2">
          <Shield className="h-4 w-4" />
          Security
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="danger" className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          Danger Zone
        </TabsTrigger>
      </TabsList>

      <TabsContent value="security" className="mt-6">
        <SecurityForm />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <PreferencesForm />
      </TabsContent>

      <TabsContent value="danger" className="mt-6">
        <DangerZone />
      </TabsContent>
    </Tabs>
  );
}
