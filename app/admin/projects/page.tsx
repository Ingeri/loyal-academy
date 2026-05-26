import { getProjects, createProject, updateProject, deleteProject, updateProjectStatus, assignProject } from '@/lib/actions/admin/projects';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye, Briefcase, DollarSign, Clock, User } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ProjectStatus } from '@prisma/client';

async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Projects</h1>
          <p className='mt-1 text-muted-foreground'>Manage outsourcing projects</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='gap-2'>
              <Plus className='h-4 w-4' />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>Add a new outsourcing project.</DialogDescription>
            </DialogHeader>
            <form action={async (formData) => {
              'use server';
              const data = {
                title: formData.get('title') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                budget: parseFloat(formData.get('budget') as string),
                timeline: formData.get('timeline') as string,
                skillsRequired: (formData.get('skillsRequired') as string).split(',').map(s => s.trim()),
                companyId: formData.get('companyId') as string,
              };
              await createProject(data);
            }}>
              <div className='space-y-4 py-4 max-h-[60vh] overflow-y-auto'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Title</Label>
                  <Input id='title' name='title' placeholder='Project title' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='slug'>Slug</Label>
                  <Input id='slug' name='slug' placeholder='project-slug' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Input id='description' name='description' placeholder='Description' required />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='budget'>Budget</Label>
                    <Input id='budget' name='budget' type='number' step='0.01' placeholder='5000' required />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='timeline'>Timeline</Label>
                    <Input id='timeline' name='timeline' placeholder='3 months' required />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='skillsRequired'>Skills Required (comma-separated)</Label>
                  <Input id='skillsRequired' name='skillsRequired' placeholder='React, Node.js, TypeScript' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='companyId'>Company ID</Label>
                  <Input id='companyId' name='companyId' placeholder='User ID' required />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className='grid gap-4'>
          {projects.map((project) => (
            <Card key={project.id} className='p-6 hover:shadow-md transition-shadow'>
              <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                {/* Project Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='font-semibold text-foreground text-lg'>{project.title}</h3>
                      <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center gap-3 mt-3'>
                    <Badge variant={
                      project.status === ProjectStatus.OPEN ? 'default' :
                      project.status === ProjectStatus.IN_PROGRESS ? 'secondary' :
                      project.status === ProjectStatus.COMPLETED ? 'outline' : 'destructive'
                    }>
                      {project.status.replace('_', ' ')}
                    </Badge>
                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                      <DollarSign className='h-4 w-4' />
                      ${project.budget.toString()}
                    </div>
                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                      <Clock className='h-4 w-4' />
                      {project.timeline}
                    </div>
                    {project.company && (
                      <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                        <User className='h-4 w-4' />
                        {project.company.name}
                      </div>
                    )}
                    {project.assignedTalent && (
                      <Badge variant='outline'>Assigned to {project.assignedTalent.name}</Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2 lg:justify-end'>
                  <Link href={`/admin/projects/${project.id}/applications`}>
                    <Button variant='outline' size='sm' className='gap-2'>
                      <Eye className='h-4 w-4' />
                      Applications
                    </Button>
                  </Link>
                  <Select onValueChange={async (value) => {
                    'use server';
                    await updateProjectStatus(project.id, value as ProjectStatus);
                  }}>
                    <SelectTrigger className='w-[140px]'>
                      <SelectValue placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProjectStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant='outline' size='sm' className='gap-2'>
                        <Edit className='h-4 w-4' />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-2xl'>
                      <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>Update project details.</DialogDescription>
                      </DialogHeader>
                      <form action={async (formData) => {
                        'use server';
                        const data = {
                          title: formData.get('title') as string,
                          slug: formData.get('slug') as string,
                          description: formData.get('description') as string,
                          budget: parseFloat(formData.get('budget') as string),
                          timeline: formData.get('timeline') as string,
                          skillsRequired: (formData.get('skillsRequired') as string).split(',').map(s => s.trim()),
                        };
                        await updateProject(project.id, data);
                      }}>
                        <div className='space-y-4 py-4 max-h-[60vh] overflow-y-auto'>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-title'>Title</Label>
                            <Input id='edit-title' name='title' defaultValue={project.title} required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-slug'>Slug</Label>
                            <Input id='edit-slug' name='slug' defaultValue={project.slug} required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-description'>Description</Label>
                            <Input id='edit-description' name='description' defaultValue={project.description} required />
                          </div>
                          <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                              <Label htmlFor='edit-budget'>Budget</Label>
                              <Input id='edit-budget' name='budget' type='number' step='0.01' defaultValue={project.budget.toString()} required />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='edit-timeline'>Timeline</Label>
                              <Input id='edit-timeline' name='timeline' defaultValue={project.timeline} required />
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-skillsRequired'>Skills Required (comma-separated)</Label>
                            <Input id='edit-skillsRequired' name='skillsRequired' defaultValue={project.skillsRequired.join(', ')} required />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type='submit'>Update</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <form action={async () => {
                    'use server';
                    await deleteProject(project.id);
                  }}>
                    <Button variant='outline' size='sm' className='text-destructive hover:text-destructive hover:bg-destructive/10'>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className='p-12 text-center'>
          <Briefcase className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground mb-6'>No projects yet. Create your first project.</p>
        </Card>
      )}
    </div>
  );
}

export default ProjectsPage;
