import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, Clock, Building2, User, ArrowLeft, Mail } from 'lucide-react';
import { getProjectBySlug } from '../../actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Project Details - Loyal Academy',
  description: 'View project details and apply',
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectslug: string }>;
}) {
  const { projectslug } = await params;
  const project = await getProjectBySlug(projectslug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 border-b">
        <div className="mx-auto max-w-6xl">
          <Link href="/outsourcing/projects">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary">Outsourcing</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Badge variant="secondary">{project.status}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {project.timeline}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              ${Number(project.budget).toLocaleString()}
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Project Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
            </Card>

            {project.skillsRequired.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {project.skillsRequired.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {project.assignedTalent && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Assigned Talent</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{project.assignedTalent.name}</p>
                    <p className="text-sm text-muted-foreground">{project.assignedTalent.email}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Company Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{project.company.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{project.company.email}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Project Status</h2>
              <Badge variant="secondary" className="w-full justify-center py-2">
                {project.status}
              </Badge>
            </Card>

            {!project.assignedTalent && project.status === 'OPEN' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Interested?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact us to express your interest in this project.
                </p>
                <Button className="w-full">Express Interest</Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
