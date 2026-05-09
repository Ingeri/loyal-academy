"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Or your preferred toast library
import { Loader2, Save, ShieldCheck } from "lucide-react";

export function SettingsForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    // Placeholder for your Server Action
    setTimeout(() => {
      setLoading(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit}>
        <Card className="p-6 space-y-6 shadow-sm border-muted/60">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user.name} required className="rounded-xl" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled className="bg-muted/50 rounded-xl" />
              <p className="text-[10px] text-muted-foreground italic">Email changes require support verification.</p>
            </div>

            <div className="space-y-2">
              <Label>Account Role</Label>
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/10 rounded-xl">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary uppercase">{user.role}</span>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full md:w-fit rounded-xl px-8">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </Card>
      </form>

      {/* Security Section Placeholder */}
      <div className="pt-4">
        <h3 className="text-lg font-bold mb-4">Security</h3>
        <Card className="p-6 border-destructive/20 bg-destructive/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-bold">Password Management</p>
                    <p className="text-xs text-muted-foreground">Change your password or set up two-factor authentication.</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl border-destructive/20 hover:bg-destructive/10 text-destructive">
                    Update Password
                </Button>
            </div>
        </Card>
      </div>
    </div>
  );
}