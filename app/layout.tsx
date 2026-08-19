import type { Metadata } from 'next'
import "./globals.css";
import { Navigation } from '@/components/navigation'
import { ConditionalFooter } from '@/components/conditional-footer'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'LOYAL Leadership Institute',
  description:
    'Developing Africa’s next generation of leaders through leadership and professional excellence.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession();

  let navUser = null;

  if (session) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, role: true },
    });

    if (dbUser) {
      navUser = { name: dbUser.name, role: dbUser.role };
    }
  }

  return (
    <html lang="en">
      <body>
        <Navigation user={navUser} />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  )
}