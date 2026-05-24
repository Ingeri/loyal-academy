import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScholarshipForm } from '@/components/donor/scholarship-form';
import { updateDonorScholarship, toggleScholarshipActive } from '@/lib/actions/donor/scholarships';
import { ScholarshipType, ApplicationStatus } from '@prisma/client';
import { 
  ArrowLeft, Calendar, DollarSign, Users, 
  FileText, CheckCircle, Clock, XCircle, 
  Eye, Edit, ToggleLeft, ToggleRight
} from 'lucide-react';

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();
  const userId = session!.userId;

  const scholarship = await prisma.scholarship.findUnique({
    where: { 
      slug,
      donorId: userId 
    },
    include: {
      applications: {
        include: {
          applicant: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
      },
    },
  });

  if (!scholarship) {
    redirect('/donor/scholarships');
  }

  const handleSubmit = async (formData: FormData) => {
    'use server';
    
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const type = formData.get('type') as ScholarshipType;
    const eligibilityCriteria = JSON.parse(formData.get('eligibilityCriteria') as string);
    const applicationDeadline = new Date(formData.get('applicationDeadline') as string);
    const maxAwards = parseInt(formData.get('maxAwards') as string);
    const donorName = formData.get('donorName') as string;
    const donorLogoUrl = formData.get('donorLogoUrl') as string;

    await updateDonorScholarship(scholarship.id, {
      title,
      slug,
      description,
      amount,
      type,
      eligibilityCriteria,
      applicationDeadline,
      maxAwards,
      donorName,
      donorLogoUrl: donorLogoUrl || null,
    });

    redirect(`/donor/scholarships/${slug}`);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const variants: Record<ApplicationStatus, string> = {
      PENDING: 'bg-yellow-500/10 text-yellow-600',
      UNDER_REVIEW: 'bg-blue-500/10 text-blue-600',
      APPROVED: 'bg-green-500/10 text-green-600',
      REJECTED: 'bg-red-500/10 text-red-600',
    };
    
    const icons: Record<ApplicationStatus, React.ReactNode> = {
      PENDING: <Clock className="h-3 w-3" />,
      UNDER_REVIEW: <Eye className="h-3 w-3" />,
      APPROVED: <CheckCircle className="h-3 w-3" />,
      REJECTED: <XCircle className="h-3 w-3" />,
    };

    return (
      <Badge className={variants[status]}>
        {icons[status]}
        <span className="ml-1">{status.replace('_', ' ')}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/donor/scholarships">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{scholarship.title}</h1>
          <p className="text-muted-foreground mt-1">
            {scholarship.isActive ? 'Active' : 'Inactive'} Scholarship
          </p>
        </div>
        <form action={async () => {
          'use server';
          await toggleScholarshipActive(scholarship.id, !scholarship.isActive);
        }}>
          <Button variant="outline" type="submit">
            {scholarship.isActive ? (
              <>
                <ToggleLeft className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <ToggleRight className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>
        </form>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Scholarship Details */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Scholarship Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1">{scholarship.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <p className="mt-1 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    ${Number(scholarship.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <p className="mt-1">{scholarship.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Max Awards</label>
                  <p className="mt-1">{scholarship.maxAwards}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Awards Granted</label>
                  <p className="mt-1">{scholarship.awardsGranted}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Application Deadline</label>
                  <p className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Applications</label>
                  <p className="mt-1 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {scholarship.applications.length}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Eligibility Criteria</label>
                <pre className="mt-1 p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(scholarship.eligibilityCriteria, null, 2)}
                </pre>
              </div>
            </div>
          </Card>

          {/* Applications */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Applications ({scholarship.applications.length})</h2>
            {scholarship.applications.length > 0 ? (
              <div className="space-y-4">
                {scholarship.applications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{application.applicant.name}</h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{application.applicant.email}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                        </p>
                        {application.motivationLetter && (
                          <div className="mt-3">
                            <label className="text-sm font-medium">Motivation Letter</label>
                            <p className="mt-1 text-sm line-clamp-3">{application.motivationLetter}</p>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/donor/scholarships/${scholarship.slug}/applications/${application.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No applications yet</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Edit Scholarship</h2>
            <ScholarshipForm 
              initialData={{
                id: scholarship.id,
                title: scholarship.title,
                slug: scholarship.slug,
                description: scholarship.description,
                amount: Number(scholarship.amount),
                type: scholarship.type,
                eligibilityCriteria: scholarship.eligibilityCriteria,
                applicationDeadline: scholarship.applicationDeadline.toISOString(),
                maxAwards: scholarship.maxAwards,
                donorName: scholarship.donorName,
                donorLogoUrl: scholarship.donorLogoUrl || undefined,
              }}
              onSubmit={handleSubmit}
              submitLabel="Update Scholarship"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
