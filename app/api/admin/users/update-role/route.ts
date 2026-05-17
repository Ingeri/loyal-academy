import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied: Admin role required' },
        { status: 403 }
      );
    }

    const { userId, role } = await request.json();
    
    console.log('Update role request:', { userId, role });
    
    // Validate inputs (user IDs are CUIDs, not UUIDs)
    const validatedUserId = z.string().min(1).parse(userId);
    const validatedRole = z.nativeEnum(UserRole).parse(role);
    
    console.log('Validated:', { validatedUserId, validatedRole });
    
    await prisma.user.update({
      where: { id: validatedUserId },
      data: { role: validatedRole },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user role:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input: ' + error.errors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
