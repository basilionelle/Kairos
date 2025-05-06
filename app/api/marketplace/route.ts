import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Configure the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Fetch all marketplace apps
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    
    // Build query
    let query = supabase
      .from('apps')
      .select('*');
    
    // Apply category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    // Apply search filter if provided
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Execute query
    const { data, error } = await query
      .order('is_new', { ascending: false })
      .order('rating', { ascending: false });
    
    if (error) {
      console.error('Error fetching marketplace apps:', error);
      return NextResponse.json(
        { error: 'Failed to fetch marketplace apps' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error('Error in marketplace API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Add a new app (admin only)
export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    
    // Check if user is authenticated and has admin role
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user role from metadata
    const userRole = session.user.app_metadata?.role;
    
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { name, description, category, icon_url, university, is_new, link } = body;
    
    // Validate required fields
    if (!name || !description || !category || !link) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Insert new app
    const { data, error } = await supabase
      .from('apps')
      .insert([
        {
          name,
          description,
          category,
          icon_url: icon_url || null,
          university: university || null,
          is_new: is_new || false,
          link,
          rating: 0.0 // Default rating
        }
      ])
      .select();
    
    if (error) {
      console.error('Error adding marketplace app:', error);
      return NextResponse.json(
        { error: 'Failed to add marketplace app' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error in marketplace API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
