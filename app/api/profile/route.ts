import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Get user profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If user doesn't exist in users table, return auth user data
    if (!data) {
      return NextResponse.json({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        bio: '',
        role: 'student',
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, avatar_url, bio } = body;

    // Check if user exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    let profileData;
    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: full_name || '',
          avatar_url: avatar_url || '',
          bio: bio || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      profileData = data;
    } else {
      // Create new user record
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            email: user.email,
            full_name: full_name || '',
            avatar_url: avatar_url || '',
            bio: bio || '',
            role: 'student',
          },
        ])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      profileData = data;
    }

    // Also update auth user metadata
    await supabase.auth.updateUser({
      data: {
        full_name: full_name || '',
        avatar_url: avatar_url || '',
      },
    });

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
