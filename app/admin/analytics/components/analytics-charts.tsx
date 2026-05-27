'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, LabelList } from 'recharts';

// Chart configuration
const chartConfig = {
  enrollments: {
    label: 'Enrollments',
    color: 'hsl(var(--chart-1))',
  },
  rating: {
    label: 'Rating',
    color: 'hsl(var(--chart-2))',
  },
  open: {
    label: 'Open',
    color: '#22c55e',
  },
  inProgress: {
    label: 'In Progress',
    color: '#3b82f6',
  },
  completed: {
    label: 'Completed',
    color: '#8b5cf6',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#ef4444',
  },
  inReview: {
    label: 'In Review',
    color: '#f59e0b',
  },
  qualityCheck: {
    label: 'Quality Check',
    color: '#06b6d4',
  },
  pending: {
    label: 'Pending',
    color: '#f59e0b',
  },
  approved: {
    label: 'Approved',
    color: '#22c55e',
  },
  rejected: {
    label: 'Rejected',
    color: '#ef4444',
  },
  underReview: {
    label: 'Under Review',
    color: '#3b82f6',
  },
  budget: {
    label: 'Budget',
    color: 'hsl(var(--chart-3))',
  },
  awards: {
    label: 'Awards Granted',
    color: 'hsl(var(--chart-4))',
  },
};

interface CourseEnrollmentChartProps {
  data: Array<{
    title: string;
    enrollments: number;
    rating: number;
    category: string;
  }>;
}

export function CourseEnrollmentChart({ data }: CourseEnrollmentChartProps) {
  // Truncate long titles for display
  const chartData = data.map((item) => ({
    ...item,
    shortTitle: item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title,
  }));

  return (
    <Card className="col-span-1 py-4 lg:col-span-2">
      <CardHeader>
        <CardTitle>Course Enrollment Density</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" />
            <YAxis
              dataKey="shortTitle"
              type="category"
              tickLine={false}
              tickMargin={10}
              width={120}
              style={{ fontSize: '12px' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="enrollments" fill="var(--color-enrollments)" radius={4}>
              <LabelList dataKey="enrollments" position="right" offset={8} className="fill-foreground" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface ProjectDistributionChartProps {
  data: Array<{
    status: string;
    count: number;
    totalBudget: number;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: '#22c55e',
  IN_PROGRESS: '#3b82f6',
  COMPLETED: '#8b5cf6',
  CANCELLED: '#ef4444',
  IN_REVIEW: '#f59e0b',
  QUALITY_CHECK: '#06b6d4',
};

export function ProjectDistributionChart({ data }: ProjectDistributionChartProps) {
  const chartData = data.map((item) => ({
    name: item.status.replace('_', ' '),
    value: item.count,
    fill: STATUS_COLORS[item.status] || '#6b7280',
  }));

  return (
    <Card className="col-span-1 py-4">
      <CardHeader>
        <CardTitle>Project Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => `${entry.name}: ${entry.value}`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface ScholarshipBudgetChartProps {
  totalScholarshipAmount: number;
  totalAwardsGranted: number;
  totalScholarships: number;
}

export function ScholarshipBudgetChart({
  totalScholarshipAmount,
  totalAwardsGranted,
  totalScholarships,
}: ScholarshipBudgetChartProps) {
  const chartData = [
    {
      name: 'Total Budget',
      value: totalScholarshipAmount,
      fill: 'var(--color-budget)',
    },
    {
      name: 'Awards Granted',
      value: totalAwardsGranted,
      fill: 'var(--color-awards)',
    },
  ];

  return (
    <Card className="col-span-1 py-4">
      <CardHeader>
        <CardTitle>Scholarship Budget vs Awards</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={(entry) => `$${entry.value.toLocaleString()}`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Total Scholarships: {totalScholarships}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface ScholarshipApplicationStatusChartProps {
  data: Array<{
    status: string;
    count: number;
  }>;
}

const APPLICATION_STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  APPROVED: '#22c55e',
  REJECTED: '#ef4444',
  UNDER_REVIEW: '#3b82f6',
};

export function ScholarshipApplicationStatusChart({ data }: ScholarshipApplicationStatusChartProps) {
  const chartData = data.map((item) => ({
    name: item.status.replace('_', ' '),
    value: item.count,
    fill: APPLICATION_STATUS_COLORS[item.status] || '#6b7280',
  }));

  return (
    <Card className="col-span-1 py-4 lg:col-span-2">
      <CardHeader>
        <CardTitle>Scholarship Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <XAxis dataKey="name" tickLine={false} tickMargin={10} />
            <YAxis tickLine={false} tickMargin={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" radius={4}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
