import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, DollarSign, Clock, ArrowRight, Filter } from 'lucide-react';
import { getProjects } from '../actions';
import Link from 'next/link';

export const metadata = {
  title: 'Projects - Loyal Academy',
  description: 'Browse open projects and find opportunities to work with our clients',
};

export default async function ProjectsPage() {
  const { projects } = await getProjects();

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-b">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary">Outsourcing</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Open Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse available projects from our partner companies. Apply your skills and build your portfolio.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Open Projects</h3>
              <p className="text-muted-foreground mb-4">Check back later for new opportunities</p>
              <Link href="/outsourcing">
                <Button variant="outline">Return to Outsourcing</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
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
                  
                  {project.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skillsRequired.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {project.skillsRequired.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.skillsRequired.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      <DollarSign className="h-4 w-4" />
                      ${Number(project.budget).toLocaleString()}
                    </div>
                  </div>
                  
                  <Link href={`/outsourcing/projects/${project.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
