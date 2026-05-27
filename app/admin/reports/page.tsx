import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/session';
import { getAllReportsData } from './actions';
import { ReportsClient } from './components/reports-client';

export default async function ReportsPage() {
  const user = await getUser();

  // Server-side role check - only ADMIN can access this page
  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/login?redirect=/admin/reports');
  }

  // Fetch all report data server-side with default filters
  const reportsData = await getAllReportsData({
    courses: { page: 1, pageSize: 50 },
    projects: { page: 1, pageSize: 50 },
    scholarships: { page: 1, pageSize: 50 },
    certificates: { page: 1, pageSize: 50 },
  });

  return <ReportsClient initialData={reportsData} />;
}
