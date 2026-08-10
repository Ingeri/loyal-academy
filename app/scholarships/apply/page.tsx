import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, CheckCircle } from 'lucide-react';
import { getScholarships } from '../actions';
import ScholarshipApplicationForm from '@/components/scholarship/scholarship-application-form';
import Link from 'next/link';

export const metadata = {
  title: 'Apply for Scholarship - Loyal Academy',
  description: 'Apply for available scholarships at Loyal Academy',
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ scholarshipId?: string }>;
}) {
  const { scholarships } = await getScholarships();
  const resolvedSearchParams = await searchParams;
  const selectedScholarshipId = resolvedSearchParams.scholarshipId;

  // Convert scholarship data to match component interface
  const formattedScholarships = scholarships.map((scholarship: any) => ({
    ...scholarship,
    amount: Number(scholarship.amount),
  }));

  return (
    <main className="min-h-screen bg-background pt-20">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?w=1920&h=1080&fit=crop"
            alt="Students studying"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>

        <div className="relative px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-8">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Scholarship Application</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              Apply for <span className="text-primary">Financial Aid</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Complete your scholarship application. Make sure to check your eligibility before submitting.
            </p>
            <Link href="/scholarships/eligibility">
              <Button variant="outline" size="lg" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Check Eligibility First
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <ScholarshipApplicationForm 
            scholarships={formattedScholarships} 
            initialScholarshipId={selectedScholarshipId} 
          />

          {/* Help Section */}
          <Card className="p-6 mt-8 bg-primary/5">
            <h3 className="font-semibold text-foreground mb-3">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you have questions about the application process or need assistance, please contact our support team.
            </p>
            <Link href="/contact">
              <Button variant="outline" size="sm">Contact Support</Button>
            </Link>
          </Card>
        </div>
      </section>

    </main>
  );
}
