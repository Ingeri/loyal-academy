import type { Metadata } from 'next'
import "../globals.css";
import { Navigation } from '@/components/navigation'
import Footer from '@/components/footer'
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export const metadata: Metadata = {
  title: 'LOYAL Leadership Institute',
  description:
    'Developing Africa’s next generation of leaders through leadership and professional excellence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <>
  <div className="min-h-screen bg-background">
        <aside className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 border-r bg-card">
          <AdminSidebar />
        </aside>
        
        <main className="md:pl-64 mt-20 flex flex-col min-h-screen">
          <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}