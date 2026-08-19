"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

const DASHBOARD_PREFIXES = ["/admin", "/instructor", "/student", "/donor"];

export function ConditionalFooter() {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (isDashboard) return null;

  return <Footer />;
}