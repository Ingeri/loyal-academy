import { redirect } from 'next/navigation';
import { ScholarshipForm } from '@/components/donor/scholarship-form';
import { createDonorScholarship } from '@/lib/actions/donor/scholarships';
import { ScholarshipType } from '@prisma/client';

export default async function NewScholarshipPage() {
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

    await createDonorScholarship({
      title,
      slug,
      description,
      amount,
      type,
      eligibilityCriteria,
      applicationDeadline,
      maxAwards,
      donorName,
      donorLogoUrl: donorLogoUrl || undefined,
    });

    redirect('/donor/scholarships');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Create New Scholarship</h1>
        <p className="text-muted-foreground mt-2">
          Set up a new scholarship program to support students
        </p>
      </header>

      <ScholarshipForm onSubmit={handleSubmit} submitLabel="Create Scholarship" />
    </div>
  );
}
