import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-foreground mb-2">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">Go to Homepage</Button>
          </Link>
          <Link href="/courses">
            <Button size="lg" variant="outline">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
