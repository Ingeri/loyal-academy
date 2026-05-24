import { getProjectBySlug } from '@/app/outsourcing/actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, Clock, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { deleteProject } from '@/app/outsourcing/actions';

export const metadata = {
  title: 'Project Details - Client Portal',
  description: 'View project details',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/client/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{project.title}</h1>
          <p className="text-muted-foreground">
            Posted on {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Project Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
          </Card>

          {project.skillsRequired.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {project.milestones && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Milestones</h2>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(project.milestones, null, 2)}
              </pre>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{project.timeline}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>${Number(project.budget).toLocaleString()}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <div className="space-y-2">
              <Link href={`/client/projects/${project.slug}/edit`} className="block">
                <Button variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
              </Link>
              <form action={async () => {
                'use server';
                await deleteProject(project.id);
              }}>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
