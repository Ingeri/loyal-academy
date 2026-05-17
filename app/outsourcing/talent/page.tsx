import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, BookOpen, Briefcase, Search } from 'lucide-react';
import { getTalentDirectory } from '../actions';
import Link from 'next/link';

export const metadata = {
  title: 'Talent Directory - Loyal Academy',
  description: 'Browse our verified graduates and alumni available for projects',
};

export default async function TalentPage() {
  const { users } = await getTalentDirectory();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-b">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary">Outsourcing</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Talent Directory</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Connect with our verified graduates and alumni. Browse their skills, certificates, and project experience.
          </p>
        </div>
      </section>

      {/* Talent Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {users.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Talent Available</h3>
              <p className="text-muted-foreground mb-4">Check back later as more graduates join our talent pool</p>
              <Link href="/outsourcing">
                <Badge variant="outline">Return to Outsourcing</Badge>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <Card key={user.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{user.name || 'Anonymous'}</h3>
                      <Badge variant="secondary" className="mt-1">{user.role}</Badge>
                    </div>
                  </div>

                  {/* Certificates */}
                  {user.certificates.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Certificates</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {user.certificates.slice(0, 3).map((cert) => (
                          <Badge key={cert.id} variant="outline" className="text-xs">
                            {cert.course.title}
                          </Badge>
                        ))}
                        {user.certificates.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.certificates.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enrollments/Skills */}
                  {user.enrollments.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Courses</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {user.enrollments.slice(0, 3).map((enrollment) => (
                          <Badge key={enrollment.id} variant="outline" className="text-xs">
                            {enrollment.course.title}
                          </Badge>
                        ))}
                        {user.enrollments.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.enrollments.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Career Fields */}
                  {user.enrollments.some(e => e.course.careerFields && e.course.careerFields.length > 0) && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Career Fields</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(new Set(
                          user.enrollments
                            .flatMap(e => e.course.careerFields || [])
                            .slice(0, 4)
                        )).map((field) => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      {user.certificates.length} certificate{user.certificates.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {user.enrollments.length} course{user.enrollments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
