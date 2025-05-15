import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Configure the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Get user profile
export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    
    // Get session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user profile from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the profile' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    
    // Get session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { full_name, university, major, graduation_year, bio, avatar_url, currentPassword, newPassword } = body;
    
    // Prepare update data for profile
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    if (full_name) updateData.full_name = full_name;
    if (university) updateData.university = university;
    if (major) updateData.major = major;
    if (graduation_year) updateData.graduation_year = graduation_year;
    if (bio) updateData.bio = bio;
    if (avatar_url) updateData.avatar_url = avatar_url;
    
    // If password change is requested
    if (currentPassword && newPassword) {
      // Update password with Supabase Auth
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (passwordError) {
        return NextResponse.json(
          { error: passwordError.message },
          { status: 400 }
        );
      }
    }
    
    // Update user profile
    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', session.user.id)
      .select('*')
      .single();
    
    if (profileError) {
      throw profileError;
    }
    
    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the profile' },
      { status: 500 }
    );
  }
}
