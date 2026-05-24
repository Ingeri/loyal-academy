import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Users, Building2, Handshake, Search, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { getProjects, getCaseStudies, getPartnerships } from './actions';
import Link from 'next/link';

export const metadata = {
  title: 'Outsourcing Services - Loyal Academy',
  description: 'Hire our talented graduates or submit projects for our talent pool to handle',
};

export default async function OutsourcingPage() {
  const { projects } = await getProjects();
  const { caseStudies } = await getCaseStudies();
  const { partnerships } = await getPartnerships();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?w=1920&h=1080&fit=crop"
            alt="Professional team working"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        </div>

        <div className="relative px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-8">
              <Briefcase className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Outsourcing Services</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              Hire <span className="text-primary">Top Talent</span> From Our Academy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect with our verified graduates and alumni for your projects. Our talent pool is trained, certified, and ready to deliver exceptional results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/outsourcing/projects">
                <Button size="lg" className="gap-2">
                  View Open Projects
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/outsourcing/talent">
                <Button size="lg" variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Browse Talent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Briefcase className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Project Posting</h3>
              <p className="text-sm text-muted-foreground">Submit your project requirements and get matched with qualified talent.</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Talent Directory</h3>
              <p className="text-sm text-muted-foreground">Browse verified graduates with certificates and skill badges.</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Building2 className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Case Studies</h3>
              <p className="text-sm text-muted-foreground">See successful projects completed by our talent pool.</p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Handshake className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Partnerships</h3>
              <p className="text-sm text-muted-foreground">Partner with us for content creation and training programs.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Open Projects</h2>
            <Link href="/outsourcing/projects">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Open Projects</h3>
              <p className="text-muted-foreground mb-4">Check back later for new opportunities</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => (
                <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary">{project.status}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {project.timeline}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      <DollarSign className="h-4 w-4" />
                      ${Number(project.budget).toLocaleString()}
                    </div>
                    <Link href={`/outsourcing/projects/${project.slug}`}>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Case Studies */}
      {caseStudies.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Success Stories</h2>
              <Link href="/outsourcing/case-studies">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.slice(0, 3).map((caseStudy) => (
                <Card key={caseStudy.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {caseStudy.imageUrl && (
                    <img
                      src={caseStudy.imageUrl}
                      alt={caseStudy.title}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-6">
                    {caseStudy.featured && (
                      <Badge className="mb-2">Featured</Badge>
                    )}
                    <h3 className="font-semibold text-foreground mb-2">{caseStudy.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{caseStudy.clientName}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{caseStudy.projectOutcome}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partnership CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-primary/5">
        <div className="mx-auto max-w-4xl text-center">
          <Handshake className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Partner With Us</h2>
          <p className="text-muted-foreground mb-8">
            Interested in content creation or specialized training partnerships? Join our network of trusted partners.
          </p>
          <Link href="/outsourcing/partnerships">
            <Button size="lg" className="gap-2">
              Submit Partnership Inquiry
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
