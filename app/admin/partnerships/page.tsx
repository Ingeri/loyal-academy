import { getPartnerships, createPartnership, updatePartnership, deletePartnership, approvePartnership, rejectPartnership } from '@/lib/actions/admin/partnerships';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Handshake, Mail, Building2, Check, X } from 'lucide-react';
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
import { PartnershipType, PartnershipStatus } from '@prisma/client';

async function PartnershipsPage() {
  const partnerships = await getPartnerships();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Partnerships</h1>
          <p className='mt-1 text-muted-foreground'>Manage partnership requests</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='gap-2'>
              <Plus className='h-4 w-4' />
              New Partnership
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Partnership</DialogTitle>
              <DialogDescription>Add a new partnership request.</DialogDescription>
            </DialogHeader>
            <form action={async (formData) => {
              'use server';
              const data = {
                companyName: formData.get('companyName') as string,
                contactEmail: formData.get('contactEmail') as string,
                contactName: formData.get('contactName') as string,
                partnershipType: formData.get('partnershipType') as PartnershipType,
                description: formData.get('description') as string,
                websiteUrl: formData.get('websiteUrl') as string || undefined,
              };
              await createPartnership(data);
            }}>
              <div className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='companyName'>Company Name</Label>
                  <Input id='companyName' name='companyName' placeholder='Company name' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='contactEmail'>Contact Email</Label>
                  <Input id='contactEmail' name='contactEmail' type='email' placeholder='contact@company.com' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='contactName'>Contact Name</Label>
                  <Input id='contactName' name='contactName' placeholder='Contact person name' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='partnershipType'>Partnership Type</Label>
                  <Select name='partnershipType' defaultValue={PartnershipType.BOTH}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PartnershipType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.toLowerCase().replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='description'>Description</Label>
                  <Input id='description' name='description' placeholder='Partnership description' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='websiteUrl'>Website URL (optional)</Label>
                  <Input id='websiteUrl' name='websiteUrl' placeholder='https://company.com' />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Partnerships Grid */}
      {partnerships.length > 0 ? (
        <div className='grid gap-4'>
          {partnerships.map((partnership) => (
            <Card key={partnership.id} className='p-6 hover:shadow-md transition-shadow'>
              <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                {/* Partnership Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='font-semibold text-foreground text-lg'>{partnership.companyName}</h3>
                      <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                        {partnership.description}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center gap-3 mt-3'>
                    <Badge variant={
                      partnership.status === PartnershipStatus.APPROVED ? 'default' :
                      partnership.status === PartnershipStatus.PENDING ? 'secondary' : 'destructive'
                    }>
                      {partnership.status}
                    </Badge>
                    <Badge variant='outline' className='capitalize'>
                      {partnership.partnershipType.toLowerCase().replace('_', ' ')}
                    </Badge>
                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                      <Mail className='h-4 w-4' />
                      {partnership.contactEmail}
                    </div>
                    <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                      <Building2 className='h-4 w-4' />
                      {partnership.contactName}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2 lg:justify-end'>
                  {partnership.status === PartnershipStatus.PENDING && (
                    <>
                      <form action={async () => {
                        'use server';
                        await approvePartnership(partnership.id);
                      }}>
                        <Button variant='outline' size='sm' className='gap-2 text-green-600 hover:text-green-700 hover:bg-green-50'>
                          <Check className='h-4 w-4' />
                          Approve
                        </Button>
                      </form>
                      <form action={async () => {
                        'use server';
                        await rejectPartnership(partnership.id);
                      }}>
                        <Button variant='outline' size='sm' className='gap-2 text-destructive hover:text-destructive hover:bg-destructive/10'>
                          <X className='h-4 w-4' />
                          Reject
                        </Button>
                      </form>
                    </>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant='outline' size='sm' className='gap-2'>
                        <Edit className='h-4 w-4' />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Partnership</DialogTitle>
                        <DialogDescription>Update partnership details.</DialogDescription>
                      </DialogHeader>
                      <form action={async (formData) => {
                        'use server';
                        const data = {
                          companyName: formData.get('companyName') as string,
                          contactEmail: formData.get('contactEmail') as string,
                          contactName: formData.get('contactName') as string,
                          partnershipType: formData.get('partnershipType') as PartnershipType,
                          description: formData.get('description') as string,
                          websiteUrl: formData.get('websiteUrl') as string || undefined,
                        };
                        await updatePartnership(partnership.id, data);
                      }}>
                        <div className='space-y-4 py-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-companyName'>Company Name</Label>
                            <Input id='edit-companyName' name='companyName' defaultValue={partnership.companyName} required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-contactEmail'>Contact Email</Label>
                            <Input id='edit-contactEmail' name='contactEmail' type='email' defaultValue={partnership.contactEmail} required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-contactName'>Contact Name</Label>
                            <Input id='edit-contactName' name='contactName' defaultValue={partnership.contactName} required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-partnershipType'>Partnership Type</Label>
                            <Select name='partnershipType' defaultValue={partnership.partnershipType}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(PartnershipType).map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type.toLowerCase().replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-description'>Description</Label>
                            <Input id='edit-description' name='description' defaultValue={partnership.description} required />
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='edit-websiteUrl'>Website URL (optional)</Label>
                            <Input id='edit-websiteUrl' name='websiteUrl' defaultValue={partnership.websiteUrl || ''} placeholder='https://company.com' />
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
                    await deletePartnership(partnership.id);
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
          <Handshake className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground mb-6'>No partnerships yet. Create your first partnership.</p>
        </Card>
      )}
    </div>
  );
}

export default PartnershipsPage;
