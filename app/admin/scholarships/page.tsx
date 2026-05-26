import { getScholarships, createScholarship, updateScholarship, deleteScholarship, getScholarshipApplications, reviewApplication } from '@/lib/actions/admin/scholarships';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye, DollarSign, Users, Calendar } from 'lucide-react';
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
import { ScholarshipType, ApplicationStatus } from '@prisma/client';

async function ScholarshipsPage() {
  const scholarships = await getScholarships();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Scholarships</h1>
          <p className='mt-1 text-muted-foreground'>Manage scholarship programs</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='gap-2'>
              <Plus className='h-4 w-4' />
              New Scholarship
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Create Scholarship</DialogTitle>
              <DialogDescription>Add a new scholarship program.</DialogDescription>
            </DialogHeader>
            <form action={async (formData) => {
              'use server';
              const data = {
                title: formData.get('title') as string,
                slug: formData.get('slug') as string,
                description: formData.get('description') as string,
                amount: parseFloat(formData.get('amount') as string),
                type: formData.get('type') as ScholarshipType,
                eligibilityCriteria: JSON.parse(formData.get('eligibilityCriteria') as string || '{}'),
                applicationDeadline: new Date(formData.get('applicationDeadline') as string),
                maxAwards: parseInt(formData.get('maxAwards') as string),
                donorName: formData.get('donorName') as string,
                donorLogoUrl: formData.get('donorLogoUrl') as string || undefined,
              };
              await createScholarship(data);
            }}>
              <div className='space-y-4 py-4 max-h-[60vh] overflow-y-auto'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Title</Label>
                  <Input id='title' name='title' placeholder='Scholarship title' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='slug'>Slug</Label>
                  <Input id='slug' name='slug' placeholder='scholarship-slug' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Input id='description' name='description' placeholder='Description' required />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='amount'>Amount</Label>
                    <Input id='amount' name='amount' type='number' step='0.01' placeholder='1000' required />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='maxAwards'>Max Awards</Label>
                    <Input id='maxAwards' name='maxAwards' type='number' placeholder='10' required />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='type'>Type</Label>
                  <Select name='type' defaultValue={ScholarshipType.GENERAL}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ScholarshipType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.toLowerCase().replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='applicationDeadline'>Application Deadline</Label>
                  <Input id='applicationDeadline' name='applicationDeadline' type='date' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='donorName'>Donor Name</Label>
                  <Input id='donorName' name='donorName' placeholder='Donor name' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='donorLogoUrl'>Donor Logo URL (optional)</Label>
                  <Input id='donorLogoUrl' name='donorLogoUrl' placeholder='https://...' />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scholarships Grid */}
      {scholarships.length > 0 ? (
        <div className='grid gap-4'>
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id} className='p-6 hover:shadow-md transition-shadow'>
              <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                {/* Scholarship Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='font-semibold text-foreground text-lg'>{scholarship.title}</h3>
                      <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                        {scholarship.description}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center gap-3 mt-3'>
                    <Badge variant={scholarship.isActive ? 'default' : 'secondary'}>
                      {scholarship.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant='outline' className='capitalize'>
                      {scholarship.type.toLowerCase().replace('_', ' ')}
                    </Badge>
                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                      <DollarSign className='h-4 w-4' />
                      ${scholarship.amount.toString()}
                    </div>
                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                      <Users className='h-4 w-4' />
                      {scholarship._count.applications} applications
                    </div>
                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                      <Calendar className='h-4 w-4' />
                      {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2 lg:justify-end'>
                  <Link href={`/admin/scholarships/${scholarship.id}/applications`}>
                    <Button variant='outline' size='sm' className='gap-2'>
                      <Eye className='h-4 w-4' />
                      Applications
                    </Button>
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant='outline' size='sm' className='gap-2'>
                        <Edit className='h-4 w-4' />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='max-w-2xl'>
                      <DialogHeader>
                        <DialogTitle>Edit Scholarship</DialogTitle>
                        <DialogDescription>Update scholarship details.</DialogDescription>
                      </DialogHeader>
                      <form action={async (formData) => {
                        'use server';
                        const data = {
                          title: formData.get('title') as string,
                          slug: formData.get('slug') as string,
                          description: formData.get('description') as string,
                          amount: parseFloat(formData.get('amount') as string),
                          type: formData.get('type') as ScholarshipType,
                          eligibilityCriteria: JSON.parse(formData.get('eligibilityCriteria') as string || '{}'),
                          applicationDeadline: new Date(formData.get('applicationDeadline') as string),
                          maxAwards: parseInt(formData.get('maxAwards') as string),
                          donorName: formData.get('donorName') as string,
                          donorLogoUrl: formData.get('donorLogoUrl') as string || undefined,
                        };
                        await updateScholarship(scholarship.id, data);
                      }}>
                        <div className='space-y-4 py-4 max-h-[60vh] overflow-y-auto'>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-title'>Title</Label>
                            <Input id='edit-title' name='title' defaultValue={scholarship.title} required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-slug'>Slug</Label>
                            <Input id='edit-slug' name='slug' defaultValue={scholarship.slug} required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-description'>Description</Label>
                            <Input id='edit-description' name='description' defaultValue={scholarship.description} required />
                          </div>
                          <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                              <Label htmlFor='edit-amount'>Amount</Label>
                              <Input id='edit-amount' name='amount' type='number' step='0.01' defaultValue={scholarship.amount.toString()} required />
                            </div>
                            <div className='space-y-2'>
                              <Label htmlFor='edit-maxAwards'>Max Awards</Label>
                              <Input id='edit-maxAwards' name='maxAwards' type='number' defaultValue={scholarship.maxAwards} required />
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-type'>Type</Label>
                            <Select name='type' defaultValue={scholarship.type}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(ScholarshipType).map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type.toLowerCase().replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-applicationDeadline'>Application Deadline</Label>
                            <Input id='edit-applicationDeadline' name='applicationDeadline' type='date' defaultValue={scholarship.applicationDeadline.toISOString().split('T')[0]} required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-donorName'>Donor Name</Label>
                            <Input id='edit-donorName' name='donorName' defaultValue={scholarship.donorName} required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-donorLogoUrl'>Donor Logo URL (optional)</Label>
                            <Input id='edit-donorLogoUrl' name='donorLogoUrl' defaultValue={scholarship.donorLogoUrl || ''} placeholder='https://...' />
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
                    await deleteScholarship(scholarship.id);
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
          <DollarSign className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground mb-6'>No scholarships yet. Create your first scholarship.</p>
        </Card>
      )}
    </div>
  );
}

export default ScholarshipsPage;
