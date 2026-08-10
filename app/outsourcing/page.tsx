import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  Users,
  Building2,
  Handshake,
  DollarSign,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { getProjects, getCaseStudies, getPartnerships } from './actions'
import Link from 'next/link'

export const metadata = {
  title: 'Outsourcing Services - Loyal Academy',
  description:
    'Hire our talented graduates or submit projects for our talent pool to handle',
}

export default async function OutsourcingPage() {
  const { projects } = await getProjects()
  const { caseStudies } = await getCaseStudies()
  await getPartnerships()

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-cover bg-center px-4 py-28 sm:px-6 lg:px-8 lg:py-36"
        style={{
          backgroundImage: "url('/hero-out-bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#06142d]/95 via-[#06142d]/75 to-[#06142d]/25" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 bg-black/20 px-5 py-2 backdrop-blur">
              <Briefcase className="h-4 w-4 text-[#d4af37]" />
              <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#d4af37]">
                Outsourcing Services
              </span>
            </div>

            <h1 className="font-serif text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              Hire <span className="italic text-[#d4af37]">Top Talent</span>
              <br />
              From Our Academy
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-9 text-white/90">
              LLI connects employers with trained, disciplined, and high-potential talent prepared to add value from day one. Our graduates are equipped with the professional skills, leadership mindset, and workplace readiness needed to contribute effectively in both public and private sector environments.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/outsourcing/projects">
                <Button
                  size="lg"
                  className="gap-2 rounded-xl bg-[#d4af37] px-8 py-7 text-base font-bold text-primary shadow-xl hover:bg-[#e6c45a]"
                >
                  View Open Projects
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/outsourcing/talent">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 rounded-xl border-[#d4af37]/70 bg-black/20 px-8 py-7 text-base font-bold text-white backdrop-blur hover:bg-white hover:text-primary"
                >
                  <Users className="h-5 w-5" />
                  Browse Talent
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-[#faf8f3] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-serif text-4xl font-bold text-primary">
            Our Services
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Briefcase, 'Project Posting', 'Submit your project requirements and get matched with qualified talent.'],
              [Users, 'Talent Directory', 'Browse verified graduates with certificates and skill badges.'],
              [Building2, 'Case Studies', 'See successful projects completed by our talent pool.'],
              [Handshake, 'Partnerships', 'Partner with us for content creation and training programs.'],
            ].map(([Icon, title, text]: any) => (
              <Card
                key={title}
                className="rounded-3xl bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <Icon className="mb-4 h-9 w-9 text-accent" />
                <h3 className="mb-2 text-lg font-bold text-primary">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section
        className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('/course-books.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-[#f8f6f1]/95 backdrop-blur-sm" />

        <div className="relative z-10 mx-auto max-w-6xl pt-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Featured Projects
              </p>

              <h2 className="font-serif text-5xl font-black tracking-tight text-black">
                Open <span className="italic text-accent">Projects</span>
              </h2>

              <p className="mt-3 max-w-xl text-base leading-7 text-slate-800">
                Browse current outsourcing opportunities and collaborate with our
                highly trained graduates and professionals.
              </p>
            </div>

            <Link href="/outsourcing/projects">
              <Button
                variant="outline"
                className="rounded-xl border-accent/40 bg-white text-slate-950 hover:bg-accent hover:text-white"
              >
                View All
              </Button>
            </Link>
          </div>

          {projects.length === 0 ? (
            <Card className="rounded-3xl bg-white/95 p-12 text-center shadow-xl">
              <Briefcase className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

              <h3 className="mb-2 text-xl font-bold text-slate-950">
                No Open Projects
              </h3>

              <p className="text-slate-700">
                Check back later for new opportunities.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => (
                <Card
                  key={project.id}
                  className="rounded-3xl border border-accent/20 bg-white/95 p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <Badge className="bg-accent/10 text-black hover:bg-accent/20">
                      {project.status}
                    </Badge>

                    <div className="flex items-center gap-1 text-sm text-slate-700">
                      <Clock className="h-4 w-4" />
                      {project.timeline}
                    </div>
                  </div>

                  <h3 className="mb-3 font-serif text-2xl font-extrabold leading-tight text-black">
                    {project.title}
                  </h3>

                  <p className="mb-5 line-clamp-3 text-sm leading-7 text-slate-700">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-accent">
                      <DollarSign className="h-4 w-4" />
                      ${Number(project.budget).toLocaleString()}
                    </div>

                    <Link href={`/outsourcing/projects/${project.slug}`}>
                      <Button
                        variant="ghost"
                        className="font-semibold text-black hover:text-accent"
                      >
                        View Details
                      </Button>
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
        <section className="bg-[#faf8f3] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-serif text-3xl font-bold text-primary">
                Success Stories
              </h2>

              <Link href="/outsourcing/case-studies">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.slice(0, 3).map((caseStudy) => (
                <Card
                  key={caseStudy.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  {caseStudy.imageUrl && (
                    <img
                      src={caseStudy.imageUrl}
                      alt={caseStudy.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    {caseStudy.featured && (
                      <Badge className="mb-2 bg-accent text-primary">
                        Featured
                      </Badge>
                    )}

                    <h3 className="mb-2 font-bold text-primary">
                      {caseStudy.title}
                    </h3>

                    <p className="mb-2 text-sm text-muted-foreground">
                      {caseStudy.clientName}
                    </p>

                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {caseStudy.projectOutcome}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partnership CTA */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl bg-[#faf8f3] px-8 py-14 text-center shadow-lg">
          <Handshake className="mx-auto mb-4 h-12 w-12 text-accent" />

          <h2 className="mb-4 font-serif text-3xl font-bold text-primary">
            Partner With Us
          </h2>

          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Interested in content creation or specialized training partnerships?
            Join our network of trusted partners.
          </p>

          <Link href="/outsourcing/partnership">
            <Button
              size="lg"
              className="gap-2 rounded-xl bg-accent px-8 py-6 font-semibold text-primary hover:bg-accent/90"
            >
              Submit Partnership Inquiry
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}