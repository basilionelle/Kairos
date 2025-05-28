import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const body = await request.json();
    
    // Get user information
    const { data: { user } } = await supabase.auth.getUser();
    
    // Validate required fields
    const { title, category } = body;
    if (!title || !category) {
      return NextResponse.json(
        { error: 'Title and category are required' },
        { status: 400 }
      );
    }
    
    // Insert the wish into Supabase
    const { data, error } = await supabase
      .from('wishes')
      .insert([
        {
          title,
          category,
          description: body.description || '',
          mockup_link: body.mockupLink || '',
        },
      ])
      .select();
    
    if (error) {
      console.error('Error inserting wish:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error processing wish submission:', error);
    return NextResponse.json(
      { error: 'Failed to process wish submission' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const url = new URL(request.url);
    
    // Get query parameters
    const category = url.searchParams.get('category');
    const searchQuery = url.searchParams.get('search');
    const sortBy = url.searchParams.get('sort') || 'votes';
    
    // Start building the query
    let query = supabase
      .from('wishes')
      .select('*');
    
    // Apply filters if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%, description.ilike.%${searchQuery}%`);
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'trending') {
      // For trending, we could use a more complex algorithm
      // This is a simplified version that considers votes and recency
      query = query.order('votes', { ascending: false }).order('created_at', { ascending: false });
    } else {
      // Default sort by votes
      query = query.order('votes', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching wishes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching wishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishes' },
      { status: 500 }
    );
  }
}
