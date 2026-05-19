import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth/session';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    await deleteSession();
    
    // Clear the session cookie explicitly
    const cookieStore = await cookies();
    cookieStore.delete('session');
    
    // Return a redirect response instead of JSON
    return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'), {
      status: 302,
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
}
