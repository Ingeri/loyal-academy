import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Save progress for a lesson
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { enrollmentId, contentId, isCompleted, completionPercentage } = body;

    if (!enrollmentId || !contentId) {
      return NextResponse.json(
        { error: 'Enrollment ID and Content ID are required' },
        { status: 400 }
      );
    }

    // Check if progress record exists
    const { data: existingProgress } = await supabase
      .from('progress')
      .select('id')
      .eq('enrollment_id', enrollmentId)
      .eq('content_id', contentId)
      .single();

    let progressData;
    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('progress')
        .update({
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq('enrollment_id', enrollmentId)
        .eq('content_id', contentId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      progressData = data;
    } else {
      // Create new progress record
      const { data, error } = await supabase
        .from('progress')
        .insert([
          {
            enrollment_id: enrollmentId,
            content_id: contentId,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
          },
        ])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      progressData = data;
    }

    // Update enrollment completion percentage
    if (completionPercentage !== undefined) {
      await supabase
        .from('enrollments')
        .update({ completion_percentage: completionPercentage })
        .eq('id', enrollmentId);
    }

    return NextResponse.json(progressData, { status: 201 });
  } catch (error) {
    console.error('Progress error:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

// Get progress for an enrollment
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enrollmentId = request.nextUrl.searchParams.get('enrollmentId');

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('enrollment_id', enrollmentId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch progress error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
