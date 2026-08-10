import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Award } from "lucide-react";
import CertificateGrid from "./_components/certificate-grid";

export default async function CertificatesPage() {
  const session = await getSession();

  // 1. Strict Security Check: Redirect if no session or no userId
  if (!session || !session.userId) {
    redirect("/auth/login");
  }

  // 2. Fetch data from Prisma
  const certificates = await prisma.certificate.findMany({
    where: { userId: session.userId },
    select: {
      id: true,
      certificateNumber: true,
      issueDate: true,
      grade: true,
      finalScore: true,
      course: {
        select: {
          title: true,
          thumbnail: true,
          duration: true,
          level: true,
        },
      },
    },
    orderBy: { issueDate: "desc" },
  });

  // 3. Robust Name Extraction: Prevents the "undefined name" error
  // Fetch user details from database using userId
  const user = session?.userId
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true },
      })
    : null;
  const displayName = user?.name || "Valued Student";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            My <span className="text-primary">Credentials</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            You have earned{" "}
            <span className="text-foreground font-bold">
              {certificates.length}
            </span>{" "}
            official certifications.
          </p>
        </div>
      </div>

      {certificates.length > 0 ? (
        <CertificateGrid certificates={certificates} userName={displayName} />
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed rounded-3xl bg-muted/5 border-muted/20">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Award className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-xl font-bold">Your gallery is empty</h2>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">
            Complete your course assessments and the final exam to unlock your
            official Loyal Academy credentials.
          </p>
        </div>
      )}
    </div>
  );
}
