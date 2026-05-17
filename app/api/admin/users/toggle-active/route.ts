import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied: Admin role required' },
        { status: 403 }
      );
    }

    const { userId, isActive } = await request.json();
    
    console.log('Toggle active request:', { userId, isActive });
    
    // Validate inputs (user IDs are CUIDs, not UUIDs)
    const validatedUserId = z.string().min(1).parse(userId);
    
    console.log('Validated:', { validatedUserId, isActive });
    
    await prisma.user.update({
      where: { id: validatedUserId },
      data: { isActive },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling user active status:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input: ' + error.errors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to toggle user status' },
      { status: 500 }
    );
  }
}
