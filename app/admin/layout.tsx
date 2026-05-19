import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { Toaster } from "@/components/ui/toaster";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session exists
  const session = await getSession();

  if (!session) {
    redirect("/auth/login?redirect=/admin");
  }

  // Server-side role check - only ADMIN allowed
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login?error=denied");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar className="hidden md:flex flex-shrink-0" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
      <Toaster />
    </div>
  );
}