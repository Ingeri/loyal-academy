"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import Footer from "@/components/footer";

const DASHBOARD_PREFIXES = ["/admin", "/instructor", "/student", "/donor"];

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}