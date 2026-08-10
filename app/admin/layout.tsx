import type { Metadata } from 'next'
import "../globals.css";
import { Navigation } from '@/components/navigation'
import Footer from '@/components/footer'

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
    <html lang="en">
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}