import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { GraduationCap, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { getScholarships } from '../actions';
import { submitScholarshipApplication } from '../actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Apply for Scholarship - Loyal Academy',
  description: 'Apply for available scholarships at Loyal Academy',
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: { scholarshipId?: string };
}) {
  const { scholarships } = await getScholarships();
  const selectedScholarshipId = searchParams.scholarshipId;

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

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
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Scholarship Application Form</h2>
            
            <form action={async (formData: FormData) => {
              'use server';
              
              const scholarshipId = formData.get('scholarshipId') as string;
              const motivationLetter = formData.get('motivationLetter') as string;
              const financialNeedProof = formData.get('financialNeedProof') as string;
              
              const result = await submitScholarshipApplication({
                scholarshipId,
                motivationLetter,
                financialNeedProof,
              });
              
              if (result.success) {
                redirect('/dashboard?tab=scholarships');
              }
            }}>
              <div className="space-y-6">
                {/* Scholarship Selection */}
                <div>
                  <Label htmlFor="scholarshipId">Select Scholarship *</Label>
                  <select
                    id="scholarshipId"
                    name="scholarshipId"
                    required
                    defaultValue={selectedScholarshipId}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                  >
                    <option value="">Choose a scholarship...</option>
                    {scholarships.map((scholarship: any) => (
                      <option key={scholarship.id} value={scholarship.id}>
                        {scholarship.title} - ${Number(scholarship.amount).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Motivation Letter */}
                <div>
                  <Label htmlFor="motivationLetter">Motivation Letter *</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Explain why you deserve this scholarship and how it will help you achieve your educational goals.
                  </p>
                  <Textarea
                    id="motivationLetter"
                    name="motivationLetter"
                    required
                    minLength={100}
                    rows={8}
                    placeholder="Write your motivation letter here (minimum 100 characters)..."
                    className="mt-2"
                  />
                </div>

                {/* Financial Need Proof */}
                <div>
                  <Label htmlFor="financialNeedProof">Financial Need Proof (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Provide any documentation or explanation of your financial situation. This is required for need-based scholarships.
                  </p>
                  <Textarea
                    id="financialNeedProof"
                    name="financialNeedProof"
                    rows={4}
                    placeholder="Describe your financial situation or provide links to supporting documents..."
                    className="mt-2"
                  />
                </div>

                {/* Important Notice */}
                <Card className="p-4 bg-muted/50 border-primary/20">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Before submitting:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Ensure you meet all eligibility criteria</li>
                        <li>Double-check your motivation letter for clarity and completeness</li>
                        <li>Submit before the application deadline</li>
                        <li>You can only apply once per scholarship</li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Button type="submit" size="lg" className="w-full gap-2">
                  Submit Application
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>

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

      <Footer />
    </main>
  );
}
