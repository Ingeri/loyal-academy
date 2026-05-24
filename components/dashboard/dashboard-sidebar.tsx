"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  UserCircle,
  Settings,
  LogOut,
  Sparkles,
  Loader2
} from "lucide-react";

const routes = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'My Courses', icon: BookOpen, href: '/dashboard/courses' },
  { label: 'Certificates', icon: Award, href: '/dashboard/certificates' },
  { label: 'Profile', icon: UserCircle, href: '/dashboard/profile' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const onLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/auth/logout", { method: "POST" });

      if (response.ok) {
        router.refresh();
        // Server handles redirect, but we can also redirect as fallback
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col h-full py-6">
      {/* Branding with Home Link & Hover Effects */}
      <div className="px-6 mb-10 hover:bg-primary/10">
        <Link 
          href="/" 
          className="flex items-center gap-2 group transition-all duration-300 hover:opacity-80 active:scale-95 w-fit"
        >
          <span className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">
            Loyal Academy
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-3 px-3 py-3 text-sm font-medium rounded transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <route.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "group-hover:text-foreground")} />
              {route.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pt-4 border-t">
        <button 
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-x-3 px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl w-full transition-colors group disabled:opacity-50"
        >
          {isLoggingOut ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}