import { getProfileData } from '../actions';
import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { StudentSidebar } from '@/components/student/student-sidebar';
import { InstructorSidebar } from '@/components/instructor/instructor-sidebar';
import { ClientSidebar } from '@/components/client/client-sidebar';
import { PortalSidebar } from '@/components/portal/portal-sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Calendar,
  Edit3,
  Share2,
  Award,
  Clock,
  BookOpen,
  Users,
  Briefcase,
  DollarSign,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';
import { ProfileForm } from './profile-form';

// Dynamic layout wrapper component based on user role
function RoleLayoutWrapper({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const SidebarComponent = {
    ADMIN: AdminSidebar,
    STUDENT: StudentSidebar,
    INSTRUCTOR: InstructorSidebar,
    CLIENT: ClientSidebar,
    DONOR: PortalSidebar,
    CAREER_ADVISOR: PortalSidebar,
  }[role] || StudentSidebar;

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 border-r bg-card">
        <SidebarComponent />
      </aside>
      <main className="md:pl-64 flex flex-col min-h-screen pt-20">
        <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const user = await getProfileData(session.userId);
  if (!user) redirect('/auth/login');

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';

  // Role-specific metadata component
  function RoleSpecificMetadata() {
    switch (user.role) {
      case 'STUDENT':
        return (
          <div className="space-y-6">
            <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
              <h3 className="font-bold mb-4 text-lg">Learning Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" /> Enrolled Courses
                  </div>
                  <span className="font-bold">{user.enrollments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> Active Courses
                  </div>
                  <span className="font-bold">
                    {user.enrollments.filter((e) => e.progress < 100).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4" /> Certificates Earned
                  </div>
                  <span className="font-bold">{user.certificates.length}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
              <h3 className="font-bold mb-4 text-lg">Recent Certificates</h3>
              {user.certificates.length > 0 ? (
                <div className="space-y-3">
                  {user.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{cert.course.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {cert.course.category.name} • Grade: {cert.grade}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">{cert.finalScore}%</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No certificates earned yet. Keep learning!
                </p>
              )}
            </Card>
          </div>
        );

      case 'INSTRUCTOR':
        return (
          <div className="space-y-6">
            <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
              <h3 className="font-bold mb-4 text-lg">Teaching Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" /> Courses Created
                  </div>
                  <span className="font-bold">{user.createdCourses.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" /> Total Students
                  </div>
                  <span className="font-bold">
                    {user.createdCourses.reduce((sum, c) => sum + c.studentNumber, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4" /> Published Courses
                  </div>
                  <span className="font-bold">
                    {user.createdCourses.filter((c) => c.published).length}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
              <h3 className="font-bold mb-4 text-lg">Your Courses</h3>
              <div className="space-y-3">
                {user.createdCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10"
                  >
                    <div>
                      <p className="text-sm font-bold">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.category.name} • {course.studentNumber} students
                      </p>
                    </div>
                    <Badge variant={course.published ? 'default' : 'secondary'}>
                      {course.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case 'CLIENT':
        return (
          <div className="space-y-6">
            <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
              <h3 className="font-bold mb-4 text-lg">Company Profile</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>Active Projects: 0</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Talent Hired: 0</span>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'DONOR':
        return (
          <div className="space-y-6">
            <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
              <h3 className="font-bold mb-4 text-lg">Donation Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Scholarships Funded: 0</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span>Students Supported: 0</span>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return (
          <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
            <p className="text-sm text-muted-foreground">
              Profile information for {user.role}
            </p>
          </Card>
        );
    }
  }

  return (
    <RoleLayoutWrapper role={user.role}>
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Glassmorphic Profile Header Card */}
        <Card className="p-8 backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10" />
          <div className="relative z-10">
            <ProfileForm user={user} />
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Role-Specific Metadata */}
          <div className="lg:col-span-1">
            <RoleSpecificMetadata />
          </div>

          {/* Right Column: Bio & Additional Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
              <h3 className="font-bold mb-4 text-lg">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {user.bio || 'No bio added yet. Tell us about yourself!'}
              </p>
            </Card>

            {user.role === 'STUDENT' && user.enrollments.length > 0 && (
              <Card className="p-6 backdrop-blur-xl bg-white/5 border-white/10">
                <h3 className="font-bold mb-4 text-lg">Current Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.enrollments.slice(0, 4).map((e) => (
                    <div
                      key={e.id}
                      className="p-4 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      <p className="text-xs font-bold text-primary uppercase mb-1">
                        {e.course.category.name}
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
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RoleLayoutWrapper>
  );
}
