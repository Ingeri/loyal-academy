import { getClientProjects } from '@/app/outsourcing/actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, Clock, Plus, ArrowRight, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteProject } from '@/app/outsourcing/actions';

export const metadata = {
  title: 'My Projects - Client Portal',
  description: 'Manage your posted projects',
};

export default async function ClientProjectsPage() {
  const { projects } = await getClientProjects();

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Projects</h1>
          <p className="text-muted-foreground">
            Manage your posted projects and track their progress
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/client/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Post New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Projects Posted Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by posting your first project to find talented students.
          </p>
          <Button asChild>
            <Link href="/client/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              Post Your First Project
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {project.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {project.timeline}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      ${Number(project.budget).toLocaleString()}
                    </div>
                  </div>

                  {project.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.skillsRequired.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {project.skillsRequired.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.skillsRequired.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Posted on {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <Link href={`/client/projects/${project.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href={`/client/projects/${project.slug}/edit`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <form action={async () => {
                    'use server';
                    await deleteProject(project.id);
                  }}>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
