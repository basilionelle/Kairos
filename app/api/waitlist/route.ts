import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Configure the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Helper function to validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;
    
    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    
    // Check if email already exists
    const { data: existingEntry } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .maybeSingle();
    
    if (existingEntry) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 200 } // Return 200 to prevent email harvesting
      );
    }
    
    // Add new entry to Supabase
    const { error } = await supabase
      .from('waitlist')
      .insert([
        {
          email,
          name: name || null
        }
      ]);
    
    if (error) {
      console.error('Error inserting into waitlist:', error);
      return NextResponse.json(
        { error: 'Failed to add to waitlist' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Successfully added to waitlist' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing waitlist submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // This endpoint would normally be protected with authentication
  try {
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    
    // Get session to check if user is authenticated and has admin role
    const { data: { session } } = await supabase.auth.getSession();
    
    // Check if user is authenticated and has admin role
    // This is a basic check - you should implement proper role-based access control
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Fetch waitlist entries from Supabase
    const { data: waitlist, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching waitlist:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve waitlist' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(waitlist || [], { status: 200 });
  } catch (error) {
    console.error('Error retrieving waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve waitlist' },
      { status: 500 }
    );
  }
}
