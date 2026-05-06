import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/certificates - List user's certificates
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const certificates = await prisma.certificate.findMany({
      where: {
        userId: user.id,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
          },
        },
      },
      orderBy: {
        issueDate: 'desc',
      },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error('Fetch certificates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}
