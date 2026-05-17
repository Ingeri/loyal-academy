import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, CheckCircle, XCircle, AlertCircle, ArrowRight, BookOpen, Trophy } from 'lucide-react';
import { getScholarships } from '../actions';
import { checkEligibility } from '../actions';
import { getUser } from '@/lib/auth/session';
import Link from 'next/link';

export const metadata = {
  title: 'Check Scholarship Eligibility - Loyal Academy',
  description: 'Check if you qualify for available scholarships at Loyal Academy',
};

export default async function EligibilityPage() {
  const { scholarships } = await getScholarships();
  const user = await getUser();

  // Check eligibility for each scholarship if user is logged in
  const eligibilityResults = user
    ? await Promise.all(
        scholarships.map(async (scholarship: any) => {
          const result = await checkEligibility(scholarship.id, user.id);
          return {
            scholarship,
            ...result,
          };
        })
      )
    : [];

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
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Eligibility Checker</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              Check Your <span className="text-primary">Eligibility</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Find out which scholarships you qualify for based on your academic performance, course progress, and other criteria.
            </p>
            {!user ? (
              <Link href="/auth/signin">
                <Button size="lg" className="gap-2">
                  Sign In to Check Eligibility
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/scholarships/apply">
                <Button size="lg" className="gap-2">
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Eligibility Results */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            {user ? 'Your Eligibility Results' : 'Available Scholarships'}
          </h2>

          {!user ? (
            <Card className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Sign In Required</h3>
              <p className="text-muted-foreground mb-6">
                You need to sign in to check your eligibility for scholarships. We'll use your course progress and certificates to determine which scholarships you qualify for.
              </p>
              <Link href="/auth/signin">
                <Button size="lg" className="gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ) : eligibilityResults.length === 0 ? (
            <Card className="p-12 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Active Scholarships</h3>
              <p className="text-muted-foreground mb-4">Check back later for new opportunities</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eligibilityResults.map(({ scholarship, eligible, reasons }: any) => (
                <Card key={scholarship.id} className={`p-6 hover:shadow-lg transition-shadow ${eligible ? 'border-green-500/50' : 'border-red-500/50'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={eligible ? 'default' : 'secondary'}>
                      {scholarship.type.replace('_', ' ')}
                    </Badge>
                    <div className={`flex items-center gap-1 text-sm ${eligible ? 'text-green-600' : 'text-red-600'}`}>
                      {eligible ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Eligible
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Not Eligible
                        </>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2">{scholarship.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{scholarship.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-primary">
                      ${Number(scholarship.amount).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {scholarship.awardsGranted}/{scholarship.maxAwards} awarded
                    </div>
                  </div>

                  {!eligible && reasons && reasons.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-md">
                      <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">Requirements not met:</p>
                      <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                        {reasons.map((reason: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1">
                            <XCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {eligible && (
                    <Link href={`/scholarships/apply?scholarshipId=${scholarship.id}`}>
                      <Button size="sm" className="w-full gap-2">
                        Apply Now
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}

                  {!eligible && (
                    <Link href={`/scholarships/${scholarship.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Eligibility Criteria Info */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Common Eligibility Criteria</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <Trophy className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Academic Performance</h3>
              <p className="text-sm text-muted-foreground">
                Minimum GPA requirements based on your course completion and final scores in completed courses.
              </p>
            </Card>
            <Card className="p-6">
              <BookOpen className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Course Progress</h3>
              <p className="text-sm text-muted-foreground">
                Some scholarships require a minimum number of completed courses or specific course achievements.
              </p>
            </Card>
            <Card className="p-6">
              <CheckCircle className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Application Status</h3>
              <p className="text-sm text-muted-foreground">
                You can only apply once per scholarship. Make sure to check your eligibility before applying.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
