import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'

const dashboardPathByRole: Record<string, string> = {
  ADMIN: '/admin',
  INSTRUCTOR: '/instructor',
  STUDENT: '/student',
  CLIENT: '/client',
  DONOR: '/donor',
  CAREER_ADVISOR: '/student',
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login?redirect=/dashboard')
  }

  redirect(dashboardPathByRole[session.role] ?? '/student')
}
