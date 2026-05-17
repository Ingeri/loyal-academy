import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, DollarSign, Calendar, Users, Heart, CheckCircle, ArrowRight, AlertCircle, Building2, XCircle } from 'lucide-react';
import { getScholarshipBySlug } from '../actions';
import { checkEligibility } from '../actions';
import { getUser } from '@/lib/auth/session';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ScholarshipPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ScholarshipPageProps) {
  const { slug } = await params;
  const scholarship = await getScholarshipBySlug(slug);
  
  if (!scholarship) {
    return {
      title: 'Scholarship Not Found - Loyal Academy',
    };
  }

  return {
    title: `${scholarship.title} - Loyal Academy`,
    description: scholarship.description,
  };
}

export default async function ScholarshipPage({ params }: ScholarshipPageProps) {
  const { slug } = await params;
  const scholarship = await getScholarshipBySlug(slug);
  const user = await getUser();

  if (!scholarship) {
    notFound();
  }

  // Check eligibility if user is logged in
  const eligibility = user ? await checkEligibility(scholarship.id, user.id) : null;
  const criteria = scholarship.eligibilityCriteria as any;

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
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Scholarship Details</span>
            </div>
            <Badge variant="secondary" className="mb-4">{scholarship.type.replace('_', ' ')}</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              {scholarship.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-8">
              {scholarship.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {eligibility?.eligible ? (
                <Link href={`/scholarships/apply?scholarshipId=${scholarship.id}`}>
                  <Button size="lg" className="gap-2">
                    Apply Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : user ? (
                <Link href="/scholarships/eligibility">
                  <Button size="lg" variant="outline" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Check Eligibility
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <Button size="lg" className="gap-2">
                    Sign In to Apply
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href="/scholarships">
                <Button size="lg" variant="outline">
                  View All Scholarships
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship Details */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Award Information */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Award Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Award Amount</p>
                      <p className="text-lg font-semibold text-foreground">
                        ${Number(scholarship.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Available Awards</p>
                      <p className="text-lg font-semibold text-foreground">
                        {scholarship.maxAwards - scholarship.awardsGranted} of {scholarship.maxAwards} remaining
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Application Deadline</p>
                      <p className="text-lg font-semibold text-foreground">
                        {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Scholarship Type</p>
                      <p className="text-lg font-semibold text-foreground">
                        {scholarship.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Eligibility Criteria */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Eligibility Criteria</h2>
                <div className="space-y-4">
                  {criteria.minGPA && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Minimum GPA</p>
                        <p className="text-sm text-muted-foreground">
                          {criteria.minGPA} or higher based on completed courses
                        </p>
                      </div>
                    </div>
                  )}
                  {criteria.requiredCourseProgress && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Course Progress</p>
                        <p className="text-sm text-muted-foreground">
                          Complete at least {criteria.requiredCourseProgress} courses
                        </p>
                      </div>
                    </div>
                  )}
                  {criteria.allowedLocations && criteria.allowedLocations.length > 0 && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Location</p>
                        <p className="text-sm text-muted-foreground">
                          Available to students in: {criteria.allowedLocations.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                  {criteria.additionalRequirements && criteria.additionalRequirements.length > 0 && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Additional Requirements</p>
                        <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                          {criteria.additionalRequirements.map((req: string, idx: number) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">General Requirements</p>
                      <p className="text-sm text-muted-foreground">
                        Must be an active student with good standing. Can only apply once per scholarship.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Application Requirements */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Application Requirements</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Motivation Letter</p>
                      <p className="text-sm text-muted-foreground">
                        A detailed letter explaining why you deserve this scholarship and how it will help you achieve your educational goals (minimum 100 characters).
                      </p>
                    </div>
                  </div>
                  {scholarship.type === 'NEED_BASED' && (
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Financial Need Proof</p>
                        <p className="text-sm text-muted-foreground">
                          Documentation or explanation of your financial situation to demonstrate need.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Academic Records</p>
                      <p className="text-sm text-muted-foreground">
                        Your course progress and certificates will be automatically verified from your profile.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Donor Information */}
              {scholarship.donor && (
                <Card className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Donor Information
                  </h3>
                  <div className="text-center">
                    {scholarship.donorLogoUrl && (
                      <img
                        src={scholarship.donorLogoUrl}
                        alt={scholarship.donorName}
                        className="h-16 w-16 mx-auto mb-4 rounded-full object-cover"
                      />
                    )}
                    <p className="font-medium text-foreground">{scholarship.donorName}</p>
                    <p className="text-sm text-muted-foreground">Scholarship Donor</p>
                  </div>
                </Card>
              )}

              {/* Eligibility Status */}
              {user && (
                <Card className={`p-6 ${eligibility?.eligible ? 'border-green-500/50 bg-green-50 dark:bg-green-950/20' : 'border-red-500/50 bg-red-50 dark:bg-red-950/20'}`}>
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    {eligibility?.eligible ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        You Are Eligible
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-600" />
                        Not Eligible
                      </>
                    )}
                  </h3>
                  {eligibility?.eligible ? (
                    <p className="text-sm text-muted-foreground mb-4">
                      You meet all the requirements for this scholarship. You can proceed with your application.
                    </p>
                  ) : (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Requirements not met:</p>
                      <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                        {eligibility?.reasons?.map((reason: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1">
                            <XCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {eligibility?.eligible && (
                    <Link href={`/scholarships/apply?scholarshipId=${scholarship.id}`}>
                      <Button size="sm" className="w-full gap-2">
                        Apply Now
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/scholarships/eligibility">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Check All Eligibility
                    </Button>
                  </Link>
                  <Link href="/scholarships">
                    <Button variant="outline" size="sm" className="w-full">
                      Browse Scholarships
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Support
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
