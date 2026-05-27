'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';
import { deactivateAccount } from '../actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function DangerZone() {
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      const result = await deactivateAccount();
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success('Account deactivated successfully');
        // Redirect to login after successful deactivation
        window.location.href = '/auth/login';
      }
    } catch (error) {
      toast.error('Failed to deactivate account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 backdrop-blur-xl bg-destructive/10 border-destructive/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-destructive/10 rounded-lg flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Irreversible and destructive actions
          </p>
        </div>
      </div>

      <Alert className="mb-6 bg-destructive/5 border-destructive/20">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertTitle className="text-destructive">Warning</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Deactivating your account will immediately suspend your access to all
          platform features. This action can be reversed by contacting support.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="font-medium text-destructive">Deactivate Account</p>
          <p className="text-sm text-muted-foreground">
            Once deactivated, you will lose access to all your data and courses
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deactivating...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deactivate Account
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will deactivate your account and you will lose access
                to all your data, courses, and certificates. This action can be
                reversed by contacting our support team.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeactivate}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes, deactivate my account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
