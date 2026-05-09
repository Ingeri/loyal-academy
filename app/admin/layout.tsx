import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { prisma } from "@/lib/prisma"; // ✅ Use Prisma instead of Supabase client
import { getSession } from "@/lib/auth/session"; // ✅ Use your session helper

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get the session (which contains the user ID/Email)
  const session = await getSession();

  if (!session) {
    redirect("/auth/login?redirect=/admin");
  }

  // 2. Fetch the user role using Prisma
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { role: true },
  });

  // 3. Check the Role (Must match the Enum 'ADMIN')
  // We use the uppercase 'ADMIN' because that is how it's defined in schema.prisma
  if (user?.role !== "ADMIN") {
    console.log("Access Denied for role:", user?.role); 
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar className="hidden md:flex flex-shrink-0" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}