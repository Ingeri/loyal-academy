import { NextResponse, type NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth/session'

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/learn', '/checkout', '/certificate']
const authRoutes = ['/auth/login', '/auth/signup']

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Check if it's an auth route (login/signup)
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  )

  // Get session from cookie
  const sessionCookie = request.cookies.get('session')?.value
  const session = await decrypt(sessionCookie)

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next({
    request,
  })
}
