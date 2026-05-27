import { getAllAnalyticsMetrics } from './actions';
import {
  CourseEnrollmentChart,
  ProjectDistributionChart,
  ScholarshipBudgetChart,
  ScholarshipApplicationStatusChart,
} from './components/analytics-charts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Star, Award, Briefcase, BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';

export default async function AnalyticsPage() {
  const metrics = await getAllAnalyticsMetrics();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format rating
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  // Calculate active projects percentage
  const activeProjectPercentage =
    metrics.outsourcing.totalProjects > 0
      ? Math.round((metrics.outsourcing.activeProjectsCount / metrics.outsourcing.totalProjects) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Comprehensive business intelligence and performance metrics
        </p>
      </div>

      {/* Financial Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Academy Revenue */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Total Academy Revenue</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {formatCurrency(metrics.financial.totalRevenue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {metrics.financial.courseCount} courses
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>

          {/* Total Discounts */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Total Discounts</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {formatCurrency(metrics.financial.totalDiscounts)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Platform-wide</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </Card>

          {/* Project Budgets */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Total Project Budgets</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {formatCurrency(metrics.financial.totalProjectBudgets)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Outsourcing projects</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>

          {/* Scholarship Budget */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Scholarship Budget</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {formatCurrency(metrics.scholarship.totalScholarshipAmount)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.scholarship.totalScholarships} scholarships
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Academic Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Academic Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Average Course Satisfaction */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Avg Course Satisfaction</p>
                <p className="text-3xl font-bold text-foreground mt-1 flex items-center gap-2">
                  {formatRating(metrics.academic.averageRating)}
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {metrics.academic.courseCount} courses
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </Card>

          {/* Total Verified Alumni */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Total Verified Alumni</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {metrics.academic.certificateCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Certificates issued</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </Card>

          {/* Total Students */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-foreground mt-1">{metrics.academic.studentCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Registered users</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>

          {/* Total Enrollments */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
                <p className="text-3xl font-bold text-foreground mt-1">{metrics.academic.totalEnrollments}</p>
                <p className="text-xs text-muted-foreground mt-1">From database</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-cyan-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Outsourcing Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Outsourcing & Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Project Streams */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Active Project Streams</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {metrics.outsourcing.activeProjectsCount}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeProjectPercentage}% of total projects
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
          </Card>

          {/* Total Projects */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold text-foreground mt-1">{metrics.outsourcing.totalProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">All statuses</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-violet-500" />
              </div>
            </div>
          </Card>

          {/* Completed Projects */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Completed Projects</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {metrics.outsourcing.statusDistribution.find((s) => s.status === 'COMPLETED')?.count || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>

          {/* Awards Granted */}
          <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-pink-500/20 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm text-muted-foreground">Scholarship Awards</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {metrics.scholarship.totalAwardsGranted}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total granted</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-pink-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Data Visualizations */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Data Visualizations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CourseEnrollmentChart data={metrics.courseEnrollment} />
          <ProjectDistributionChart data={metrics.outsourcing.statusDistribution} />
          <ScholarshipBudgetChart
            totalScholarshipAmount={metrics.scholarship.totalScholarshipAmount}
            totalAwardsGranted={metrics.scholarship.totalAwardsGranted}
            totalScholarships={metrics.scholarship.totalScholarships}
          />
          <ScholarshipApplicationStatusChart data={metrics.scholarship.statusDistribution} />
        </div>
      </div>

      {/* Quick Status Summary */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Status Summary</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Project Status Breakdown */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Project Status</p>
                <div className="space-y-2">
                  {metrics.outsourcing.statusDistribution.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.status.replace('_', ' ')}</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scholarship Application Status */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Scholarship Applications</p>
                <div className="space-y-2">
                  {metrics.scholarship.statusDistribution.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{item.status.replace('_', ' ')}</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Ratios */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Key Ratios</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Student Activity</span>
                    <Badge variant="outline">
                      {metrics.academic.studentCount > 0
                        ? Math.round((metrics.academic.activeStudents / metrics.academic.studentCount) * 100)
                        : 0}
                      %
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Certification Rate</span>
                    <Badge variant="outline">
                      {metrics.academic.activeStudents > 0
                        ? Math.round((metrics.academic.certificateCount / metrics.academic.activeStudents) * 100)
                        : 0}
                      %
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Project Completion</span>
                    <Badge variant="outline">
                      {metrics.outsourcing.totalProjects > 0
                        ? Math.round(
                            ((metrics.outsourcing.statusDistribution.find((s) => s.status === 'COMPLETED')
                              ?.count || 0) /
                              metrics.outsourcing.totalProjects) *
                              100
                          )
                        : 0}
                      %
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Awards Utilization */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Awards Utilization</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Budget Utilized</span>
                    <Badge variant="outline">
                      {metrics.scholarship.totalScholarshipAmount > 0
                        ? Math.round((metrics.scholarship.totalAwardsGranted / metrics.scholarship.totalScholarshipAmount) * 100)
                        : 0}
                      %
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Award Value</span>
                    <Badge variant="outline">
                      {metrics.scholarship.totalAwardsGranted > 0
                        ? formatCurrency(
                            metrics.scholarship.totalAwardsGranted / metrics.scholarship.totalAwardsGranted
                          )
                        : '$0'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
