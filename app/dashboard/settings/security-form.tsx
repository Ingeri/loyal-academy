'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';
import { updatePassword } from '../actions';

export function SecurityForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updatePassword(formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success('Password updated successfully!');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Security Credentials</h3>
          <p className="text-sm text-muted-foreground">
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input
            id="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            required
            className="rounded-xl bg-background/50"
            placeholder="Enter your current password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            required
            className="rounded-xl bg-background/50"
            placeholder="Enter your new password"
            minLength={6}
          />
          <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            className="rounded-xl bg-background/50"
            placeholder="Confirm your new password"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full rounded-xl">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Password...
            </>
          ) : (
            'Update Password'
          )}
        </Button>
      </form>
    </Card>
  );
}
