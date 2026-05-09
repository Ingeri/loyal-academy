import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit3,
  Share2,
  Award,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

 const user = await prisma.user.findUnique({
  where: { id: session.userId },
  include: {
    enrollments: { 
      include: { 
        course: {
          include: {
            category: true
          }
        } 
      } 
    },
    certificates: true
  }
});

  if (!user) return null;

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header Card */}
      <Card className="p-8 border-none shadow-xl bg-gradient-to-r from-primary/10 via-background to-background relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Placeholder */}
          <div className="h-32 w-32 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground text-4xl font-black shadow-2xl ring-4 ring-background">
            {user.name?.charAt(0) || "U"}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">
                {user.name}
              </h1>
              <Badge
                variant="secondary"
                className="w-fit mx-auto md:mx-0 uppercase tracking-widest text-[10px] font-bold"
              >
                {user.role}
              </Badge>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> {user.email}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Joined {joinDate}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              asChild
            >
              <Link href="/dashboard/settings">
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full h-10 w-10 p-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Learning Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> Courses Active
                </div>
                <span className="font-bold">
                  {user.enrollments.filter((e) => e.progress < 100).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4" /> Certificates
                </div>
                <span className="font-bold">{user.certificates.length}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-2">About Me</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {/* Replace with actual bio field if added to schema */}
              Passionate learner currently expanding my skills at Loyal
              Leadership Academy.
            </p>
          </Card>
        </div>

        {/* Right Column: Activity / Recent Progress */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" /> Recent Achievements
          </h2>

          <div className="grid gap-4">
            {user.certificates.length > 0 ? (
              user.certificates.map((cert) => (
                <Card
                  key={cert.id}
                  className="p-4 flex items-center justify-between bg-muted/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        Certificate of Completion
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Course ID: {cert.courseId}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Card>
              ))
            ) : (
              <div className="py-12 text-center border-2 border-dashed rounded-2xl">
                <p className="text-muted-foreground text-sm">
                  No badges earned yet. Keep studying!
                </p>
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold pt-4">Current Focus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.enrollments.slice(0, 2).map((e) => (
              <Card
                key={e.id}
                className="p-4 hover:border-primary/50 transition-colors"
              >
                <p className="text-xs font-bold text-primary uppercase mb-1">
                  {(e.course.category as any)?.name || "Course"}
                </p>
                <h4 className="font-bold text-sm line-clamp-1 mb-2">
                  {e.course.title}
                </h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${e.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold">
                    {Math.round(e.progress)}%
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
