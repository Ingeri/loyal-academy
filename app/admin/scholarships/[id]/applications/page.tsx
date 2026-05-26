import { getScholarshipDetails, reviewApplication } from '@/lib/actions/admin/scholarships';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Check, X, FileText, DollarSign, Calendar, User, Mail } from 'lucide-react';
import Link from 'next/link';
import { ApplicationStatus } from '@prisma/client';

async function ScholarshipApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scholarship = await getScholarshipDetails(id);

  if (!scholarship) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Link href='/admin/scholarships'>
            <Button variant='ghost' size='icon'>
              <ArrowLeft className='h-5 w-5' />
            </Button>
          </Link>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>Scholarship Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link href='/admin/scholarships'>
          <Button variant='ghost' size='icon'>
            <ArrowLeft className='h-5 w-5' />
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>{scholarship.title}</h1>
          <p className='mt-1 text-muted-foreground'>Review scholarship applications</p>
        </div>
      </div>

      {/* Scholarship Info */}
      <Card className='p-6'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <DollarSign className='h-4 w-4' />
            ${scholarship.amount.toString()}
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Calendar className='h-4 w-4' />
            Deadline: {new Date(scholarship.applicationDeadline).toLocaleDateString()}
          </div>
          <Badge variant={scholarship.isActive ? 'default' : 'secondary'}>
            {scholarship.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant='outline'>
            {scholarship.applications.length} applications
          </Badge>
        </div>
      </Card>

      {/* Applications List */}
      {scholarship.applications.length > 0 ? (
        <div className='space-y-4'>
          {scholarship.applications.map((application: any) => (
            <Card key={application.id} className='p-6'>
              <div className='space-y-4'>
                {/* Applicant Info */}
                <div className='flex items-start justify-between gap-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4 text-muted-foreground' />
                      <span className='font-semibold text-foreground'>{application.applicant?.name || 'Unknown'}</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Mail className='h-4 w-4' />
                      {application.applicant?.email || 'No email'}
                    </div>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Calendar className='h-4 w-4' />
                      Applied: {new Date(application.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge
                    variant={
                      application.status === ApplicationStatus.APPROVED ? 'default' :
                      application.status === ApplicationStatus.REJECTED ? 'destructive' :
                      'secondary'
                    }
                  >
                    {application.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Motivation Letter */}
                <div className='space-y-2'>
                  <div className='flex items-center gap-2 text-sm font-medium text-foreground'>
                    <FileText className='h-4 w-4' />
                    Motivation Letter
                  </div>
                  <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{application.motivationLetter}</p>
                </div>

                {/* Financial Need Proof */}
                {application.financialNeedProof && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm font-medium text-foreground'>
                      <FileText className='h-4 w-4' />
                      Financial Need Proof
                    </div>
                    <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{application.financialNeedProof}</p>
                  </div>
                )}

                {/* Additional Documents */}
                {application.additionalDocuments && Array.isArray(application.additionalDocuments) && application.additionalDocuments.length > 0 && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm font-medium text-foreground'>
                      <FileText className='h-4 w-4' />
                      Additional Documents
                    </div>
                    <div className='space-y-1'>
                      {application.additionalDocuments.map((doc: any, index: number) => (
                        <a
                          key={index}
                          href={doc.url || '#'}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-primary hover:underline block'
                        >
                          {doc.name || `Document ${index + 1}`}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Notes (if already reviewed) */}
                {application.reviewNotes && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-sm font-medium text-foreground'>
                      <FileText className='h-4 w-4' />
                      Review Notes
                    </div>
                    <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{application.reviewNotes}</p>
                    {application.reviewedBy && (
                      <p className='text-xs text-muted-foreground'>
                        Reviewed by: {application.reviewer?.name || 'Admin'}
                      </p>
                    )}
                  </div>
                )}

                {/* Review Actions */}
                {application.status === ApplicationStatus.PENDING && (
                  <div className='space-y-3 pt-4 border-t'>
                    <div className='space-y-2'>
                      <label htmlFor={`review-notes-${application.id}`} className='text-sm font-medium text-foreground'>
                        Review Notes (optional)
                      </label>
                      <Textarea
                        id={`review-notes-${application.id}`}
                        name='reviewNotes'
                        placeholder='Add your review notes here...'
                        rows={2}
                      />
                    </div>
                    <div className='flex gap-2'>
                      <form action={async (formData) => {
                        'use server';
                        const reviewNotes = formData.get('reviewNotes') as string;
                        await reviewApplication(application.id, ApplicationStatus.APPROVED, reviewNotes);
                      }} className='flex-1'>
                        <Button type='submit' size='sm' className='gap-2 w-full'>
                          <Check className='h-4 w-4' />
                          Approve
                        </Button>
                      </form>
                      <form action={async (formData) => {
                        'use server';
                        const reviewNotes = formData.get('reviewNotes') as string;
                        await reviewApplication(application.id, ApplicationStatus.REJECTED, reviewNotes);
                      }} className='flex-1'>
                        <Button type='submit' variant='destructive' size='sm' className='gap-2 w-full'>
                          <X className='h-4 w-4' />
                          Reject
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className='p-12 text-center'>
          <FileText className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground mb-6'>No applications yet for this scholarship.</p>
        </Card>
      )}
    </div>
  );
}

export default ScholarshipApplicationsPage;
