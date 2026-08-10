import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, DollarSign, Calendar, Users, Heart, CheckCircle, ArrowRight } from 'lucide-react';
import { getScholarships, getDonors } from './actions';
import Link from 'next/link';

export const metadata = {
  title: 'Scholarships - Loyal Academy',
  description: 'Financial aid and scholarship opportunities for students',
};

export default async function ScholarshipsPage() {
  const { scholarships } = await getScholarships();
  const { donors } = await getDonors();

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
              <span className="text-sm font-medium text-primary">Financial Aid</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              <span className="text-primary">Scholarships</span> & Financial Aid
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Access quality education without financial barriers. Explore our scholarship programs designed to support deserving students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scholarships/apply">
                <Button size="lg" className="gap-2">
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/scholarships/eligibility">
                <Button size="lg" variant="outline" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Check Eligibility
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarship Types */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Scholarship Types</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <GraduationCap className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Merit-Based</h3>
              <p className="text-sm text-muted-foreground">For students with outstanding academic performance and achievements.</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Heart className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Need-Based</h3>
              <p className="text-sm text-muted-foreground">Financial support for students demonstrating financial need.</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Women in Tech</h3>
              <p className="text-sm text-muted-foreground">Empowering women to pursue careers in technology and innovation.</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <DollarSign className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">General</h3>
              <p className="text-sm text-muted-foreground">Open to all students meeting basic eligibility criteria.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Scholarships */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground mb-8">Available Scholarships</h2>
          {scholarships.length === 0 ? (
            <Card className="p-12 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Active Scholarships</h3>
              <p className="text-muted-foreground mb-4">Check back later for new opportunities</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {scholarships.map((scholarship: any) => (
                <Card key={scholarship.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary">{scholarship.type.replace('_', ' ')}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{scholarship.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{scholarship.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      <DollarSign className="h-4 w-4" />
                      ${Number(scholarship.amount).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {scholarship.awardsGranted}/{scholarship.maxAwards} awarded
                    </div>
                  </div>
                  <Link href={`/scholarships/${scholarship.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">View Details</Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Donor Recognition */}
      {donors.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Generous Donors</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {donors.slice(0, 6).map((donor: any) => (
                <Card key={donor.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                  {donor.donorLogoUrl && (
                    <img
                      src={donor.donorLogoUrl}
                      alt={donor.name}
                      className="h-16 w-16 mx-auto mb-4 rounded-full object-cover"
                    />
                  )}
                  <h3 className="font-semibold text-foreground mb-2">{donor.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {donor.scholarships.length} scholarship{donor.scholarships.length !== 1 ? 's' : ''} funded
                  </p>
                  <div className="text-sm text-primary font-medium">
                    ${donor.scholarships.reduce((sum: number, s: any) => sum + Number(s.amount), 0).toLocaleString()} total
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How to Apply */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-primary/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">How to Apply</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">1. Check Eligibility</h3>
              <p className="text-sm text-muted-foreground">Use our eligibility checker to verify if you qualify for available scholarships.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">2. Prepare Documents</h3>
              <p className="text-sm text-muted-foreground">Gather your motivation letter, financial need proof, and other required documents.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">3. Submit Application</h3>
              <p className="text-sm text-muted-foreground">Complete the application form and submit before the deadline.</p>
            </Card>
          </div>
        </div>
      </section>

    </main>
  );
}
