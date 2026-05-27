'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Bell } from 'lucide-react';
import { updateNotificationPreferences, getNotificationPreferences } from '../actions';

export function PreferencesForm() {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    emailSummaries: false,
    lessonAlerts: false,
    securityAlerts: false,
  });

  useEffect(() => {
    // Load current preferences from server
    async function loadPreferences() {
      try {
        const result = await getNotificationPreferences();
        if (result.success && result.preferences) {
          setPreferences({
            emailSummaries: result.preferences.emailSummaries ?? true,
            lessonAlerts: result.preferences.lessonAlerts ?? true,
            securityAlerts: result.preferences.securityAlerts ?? true,
          });
        } else {
          // Use default values if fetch fails
          setPreferences({
            emailSummaries: true,
            lessonAlerts: true,
            securityAlerts: true,
          });
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
        // Use default values on error
        setPreferences({
          emailSummaries: true,
          lessonAlerts: true,
          securityAlerts: true,
        });
      }
    }
    loadPreferences();
  }, []);

  const handleToggle = async (key: keyof typeof preferences) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    setLoading(true);

    try {
      const result = await updateNotificationPreferences(newPreferences);
      if (result.error) {
        toast.error(result.error);
        // Revert on error
        setPreferences(preferences);
      } else if (result.success) {
        toast.success('Notification preferences updated!');
      }
    } catch (error) {
      toast.error('Failed to update preferences');
      // Revert on error
      setPreferences(preferences);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Communication Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Manage how you receive notifications and updates
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailSummaries" className="text-base">
              Email Summaries
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive weekly email summaries of your activity
            </p>
          </div>
          <Switch
            id="emailSummaries"
            checked={preferences.emailSummaries}
            onCheckedChange={() => handleToggle('emailSummaries')}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="lessonAlerts" className="text-base">
              Lesson Alerts
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified when new lessons are available in your courses
            </p>
          </div>
          <Switch
            id="lessonAlerts"
            checked={preferences.lessonAlerts}
            onCheckedChange={() => handleToggle('lessonAlerts')}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="securityAlerts" className="text-base">
              Security Alerts
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about account security and sign-ins
            </p>
          </div>
          <Switch
            id="securityAlerts"
            checked={preferences.securityAlerts}
            onCheckedChange={() => handleToggle('securityAlerts')}
            disabled={loading}
          />
        </div>
      </div>
    </Card>
  );
}
