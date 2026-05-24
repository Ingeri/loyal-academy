import { getProjectBySlug, updateProject } from '@/app/outsourcing/actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Project - Client Portal',
  description: 'Edit your project posting',
};

export default async function EditProjectPage({
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
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/client/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Project</h1>
          <p className="text-muted-foreground">
            Update your project details
          </p>
        </div>
      </div>

      <Card className="p-8">
        <form action={async (formData) => {
          'use server';
          const title = formData.get('title') as string;
          const description = formData.get('description') as string;
          const budget = Number(formData.get('budget')) as number;
          const timeline = formData.get('timeline') as string;
          const skillsRequired = formData.get('skillsRequired') as string;

          const result = await updateProject(project.id, {
            title,
            description,
            budget,
            timeline,
            skillsRequired: skillsRequired.split(',').map(s => s.trim()).filter(s => s),
          });

          if (result.success) {
            redirect('/client/projects');
          }
        }} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              name="title"
              defaultValue={project.title}
              placeholder="e.g., E-commerce Website Development"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={project.description}
              placeholder="Describe your project in detail..."
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD) *</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                defaultValue={Number(project.budget)}
                placeholder="5000"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline *</Label>
              <Input
                id="timeline"
                name="timeline"
                defaultValue={project.timeline}
                placeholder="e.g., 2-3 months"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillsRequired">Skills Required *</Label>
            <Input
              id="skillsRequired"
              name="skillsRequired"
              defaultValue={project.skillsRequired.join(', ')}
              placeholder="e.g., React, Node.js, PostgreSQL (comma-separated)"
              required
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple skills with commas
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              <Briefcase className="h-4 w-4 mr-2" />
              Update Project
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/client/projects">Cancel</Link>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
