import { getUserProjectApplications } from '@/app/outsourcing/actions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Project Applications - Student Portal',
  description: 'View and follow up on your project applications',
};

export default async function ProjectApplicationsPage() {
  const { applications } = await getUserProjectApplications();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Project Applications</h1>
        <p className="text-muted-foreground">
          Track your project applications and their status
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't applied to any projects yet. Browse available projects and express your interest.
          </p>
          <Link href="/outsourcing/projects">
            <Button>Browse Projects</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {applications.map((application) => (
            <Card key={application.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {application.project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {application.project.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {application.project.timeline}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      ${Number(application.project.budget).toLocaleString()}
                    </div>
                    <Badge variant="outline" className={getProjectStatusColor(application.project.status)}>
                      Project: {application.project.status}
                    </Badge>
                  </div>

                  {application.project.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {application.project.skillsRequired.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {application.project.skillsRequired.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{application.project.skillsRequired.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  {application.coverLetter && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">Your Cover Letter:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <Link href={`/outsourcing/projects/${application.project.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Project
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
