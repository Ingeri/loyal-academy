import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { params } = await context;
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const course = await prisma.course.findUnique({ where: { id: params.id } });
        if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        if (course.instructorId !== session.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.course.delete({ where: { id: params.id } });

        return NextResponse.json({ message: 'Course deleted' });
    } catch (error) {
        console.error('Delete course error:', error);
        return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { params } = await context;
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        const course = await prisma.course.findUnique({ where: { id: params.id } });
        if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        if (course.instructorId !== session.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const allowed: any = {};
        // allow updating title, description, price, published flag, and thumbnail
        if (body.title) allowed.title = body.title;
        if (body.description) allowed.description = body.description;
        if (body.price !== undefined) allowed.price = body.price;
        if (body.published !== undefined) allowed.published = body.published;
        if (body.thumbnail !== undefined) allowed.thumbnail = body.thumbnail;

        const updated = await prisma.course.update({ where: { id: params.id }, data: allowed });

        return NextResponse.json({ message: 'Course updated', course: updated });
    } catch (error) {
        console.error('Update course error:', error);
        return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
    }
}
