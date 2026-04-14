import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Create a new enrollment
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment
    const { data, error } = await supabase
      .from('enrollments')
      .insert([
        {
          student_id: user.id,
          course_id: courseId,
          enrollment_date: new Date().toISOString(),
          completion_percentage: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { error: 'Failed to create enrollment' },
      { status: 500 }
    );
  }
}

// Get user's enrollments
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('student_id', user.id)
      .order('enrollment_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch enrollments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}
