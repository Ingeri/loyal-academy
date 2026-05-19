import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth/session';

// Define route access rules by role
const routeAccess = {
  '/student': ['STUDENT'],
  '/instructor': ['INSTRUCTOR'],
  '/client': ['CLIENT'],
  '/donor': ['DONOR'],
  '/admin': ['ADMIN'],
};

// Helper to check if a path starts with any of the protected routes
function getProtectedRoute(pathname: string): string | null {
  if (pathname.startsWith('/student')) return '/student';
  if (pathname.startsWith('/instructor')) return '/instructor';
  if (pathname.startsWith('/client')) return '/client';
  if (pathname.startsWith('/donor')) return '/donor';
  if (pathname.startsWith('/admin')) return '/admin';
  return null;
}

// Helper to get the appropriate dashboard for a role
function getDashboardForRole(role: string): string {
  switch (role) {
    case 'STUDENT':
      return '/student';
    case 'INSTRUCTOR':
      return '/instructor';
    case 'ADMIN':
      return '/admin';
    case 'CLIENT':
      return '/client';
    case 'DONOR':
      return '/donor';
    case 'CAREER_ADVISOR':
      return '/student'; // Postponed, redirect to student dashboard for now
    default:
      return '/student';
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for static files, API routes, and auth pages
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const protectedRoute = getProtectedRoute(pathname);
  
  // If not accessing a protected route, allow access
  if (!protectedRoute) {
    return NextResponse.next();
  }

  // Check for session
  const session = await decrypt(request.cookies.get('session')?.value);
  
  // If no session, redirect to login
  if (!session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if user's role has access to this route
  const allowedRoles = routeAccess[protectedRoute as keyof typeof routeAccess];
  
  if (!allowedRoles || !allowedRoles.includes(session.role)) {
    // Redirect to appropriate dashboard for their role
    const correctDashboard = getDashboardForRole(session.role);
    // Only redirect if not already on the correct dashboard to prevent loops
    if (pathname !== correctDashboard && !pathname.startsWith(correctDashboard)) {
      return NextResponse.redirect(new URL(correctDashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
