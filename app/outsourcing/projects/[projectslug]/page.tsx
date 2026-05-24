import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, DollarSign, Clock, ArrowLeft } from 'lucide-react';
import { getProjectBySlug, expressInterestInProject, hasUserAppliedToProject } from '../../actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Project Details - Loyal Academy',
  description: 'View project details and apply',
};

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectslug: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { projectslug } = await params;
  const { success } = await searchParams;
  const project = await getProjectBySlug(projectslug);
  const hasApplied = await hasUserAppliedToProject(project.id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="px-4 py-8 sm:px-6 lg:px-8 border-b">
        <div className="mx-auto max-w-6xl">
          {success === 'true' && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">Interest expressed successfully!</p>
              <p className="text-green-700 text-sm">We'll review your application and get back to you soon.</p>
            </div>
          )}
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

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Project Status</h2>
              <Badge variant="secondary" className="w-full justify-center py-2">
                {project.status}
              </Badge>
            </Card>

            {project.status === 'OPEN' && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Interested?</h2>
                {hasApplied ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      You have already expressed interest in this project. We'll review your application and get back to you soon.
                    </p>
                    <Button disabled className="w-full">
                      Application Submitted
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Express your interest in this project by submitting a cover letter.
                    </p>
                    <form action={async (formData) => {
                      'use server';
                      const coverLetter = formData.get('coverLetter') as string;
                      const result = await expressInterestInProject(project.id, coverLetter);
                      if (result.success) {
                        redirect(`/outsourcing/projects/${projectslug}?success=true`);
                      }
                    }}>
                      <Textarea
                        name="coverLetter"
                        placeholder="Tell us why you're interested in this project and highlight your relevant skills..."
                        className="min-h-[120px] mb-4"
                      />
                      <Button type="submit" className="w-full">
                        Express Interest
                      </Button>
                    </form>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}