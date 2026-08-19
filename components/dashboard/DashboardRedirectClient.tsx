"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowRight } from "lucide-react";

interface DashboardRedirectProps {
  role: string;
  targetUrl: string;
}

export default function DashboardRedirectClient({ role, targetUrl }: DashboardRedirectProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer interval
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Actual redirection action when countdown hits 0
    const redirectTimeout = setTimeout(() => {
      router.push(targetUrl);
      router.refresh();
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [router, targetUrl]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-muted/5">
      <Card className="w-full max-w-md shadow-xl border-muted/50 text-center py-6">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription className="text-sm mt-1">
            Detected Account Role: <span className="font-semibold text-foreground uppercase">{role}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We are redirecting you to your designated portal dashboard in{" "}
            <span className="font-bold text-primary text-base">{countdown}</span> seconds...
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                router.push(targetUrl);
                router.refresh();
              }}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Go Now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}