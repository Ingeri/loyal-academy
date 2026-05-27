import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  XCircle,
  FileText
} from 'lucide-react';
import { getScholarshipDashboardData } from '../../scholarships/actions';

export const dynamic = 'force-dynamic';

export default async function ScholarshipsPage() {
  const { eligibleScholarships, myApplications, stats } = await getScholarshipDashboardData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'UNDER_REVIEW':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'APPROVED':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'REJECTED':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'UNDER_REVIEW':
        return <FileText className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Scholarships</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            {stats ? `You've applied to ${stats.totalApplied} scholarship${stats.totalApplied !== 1 ? 's' : ''}` : 'Explore available scholarships'}
          </p>
        </div>
      </header>

      {/* Stats */}
      {stats && stats.totalApplied > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Applied" value={stats.totalApplied} color="bg-blue-500/10" />
          <StatCard label="Pending" value={stats.pending} color="bg-yellow-500/10" />
          <StatCard label="Under Review" value={stats.underReview} color="bg-indigo-500/10" />
          <StatCard label="Approved" value={stats.approved} color="bg-green-500/10" />
          <StatCard label="Rejected" value={stats.rejected} color="bg-red-500/10" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Eligible Scholarships */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              Eligible Scholarships
            </h2>
            <Badge variant="outline">{eligibleScholarships.length} available</Badge>
          </div>

          <div className="space-y-4">
            {eligibleScholarships.length > 0 ? eligibleScholarships.map((scholarship: any) => (
              <Card key={scholarship.id} className="p-6 hover:border-primary/50 hover:shadow-md transition-all bg-card/50">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{scholarship.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{scholarship.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-medium">${Number(scholarship.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Deadline: {new Date(scholarship.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="secondary">{scholarship.type}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Donor: {scholarship.donor?.name || scholarship.donorName}
                    </span>
                    <Button size="sm" asChild>
                      <Link href={`/scholarships/apply?scholarshipId=${scholarship.id}`}>
                        Apply Now <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            )) : (
              <Card className="p-12 text-center border-dashed bg-muted/5">
                <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No eligible scholarships at the moment.</p>
                <p className="text-xs text-muted-foreground mt-2">Check back later for new opportunities!</p>
              </Card>
            )}
          </div>
        </div>

        {/* My Applications */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              My Applications
            </h2>
            <Badge variant="outline">{myApplications.length} submitted</Badge>
          </div>

          <div className="space-y-4">
            {myApplications.length > 0 ? myApplications.map((application: any) => (
              <Card key={application.id} className="p-6 bg-card/50">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{application.scholarship.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${Number(application.scholarship.amount).toLocaleString()} • {application.scholarship.type}
                      </p>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(application.status)}
                        {application.status.replace('_', ' ')}
                      </div>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Submitted</p>
                      <p className="font-medium">{new Date(application.submittedAt).toLocaleDateString()}</p>
                    </div>
                    {application.reviewedAt && (
                      <div>
                        <p className="text-xs text-muted-foreground">Reviewed</p>
                        <p className="font-medium">{new Date(application.reviewedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {application.reviewNotes && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Review Notes</p>
                      <p className="text-sm">{application.reviewNotes}</p>
                    </div>
                  )}
                </div>
              </Card>
            )) : (
              <Card className="p-12 text-center border-dashed bg-muted/5">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">You haven't applied to any scholarships yet.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/scholarships">Browse Scholarships</Link>
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card className="p-4 flex flex-col gap-2 border-none shadow-sm bg-card/60">
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</div>
    </Card>
  );
}
