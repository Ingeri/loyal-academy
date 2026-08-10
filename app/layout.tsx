import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/navigation'
import Footer from '@/components/footer'
import { WebsiteAssistant } from '@/components/website-assistant'

export const metadata: Metadata = {
  title: 'LOYAL Leadership Institute',
  description:
    'Developing Africa’s next generation of leaders through leadership and professional excellence.',

  // Browser Tab Icons (Favicon)
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-icon.png',
  },

  openGraph: {
    title: 'LOYAL Leadership Institute',
    description:
      'Developing Africa’s next generation of leaders through leadership and professional excellence.',
    type: 'website',
    images: [
      {
        url: '/lli-logo.png',
        alt: 'LOYAL Leadership Institute Logo',
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'LOYAL Leadership Institute',
    description:
      'Developing Africa’s next generation of leaders through leadership and professional excellence.',
    images: ['/lli-logo.png'],
  },
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
        <WebsiteAssistant />
      </body>
    </html>
  )
}