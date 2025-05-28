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
    
    // Get user information if available
    const { data: { user } } = await supabase.auth.getUser();
    
    // Validate required fields
    const { wishId } = body;
    if (!wishId) {
      return NextResponse.json(
        { error: 'Wish ID is required' },
        { status: 400 }
      );
    }
    
    // For anonymous voting, we'll use client-side tracking via localStorage
    // The API won't check for duplicate votes - this is handled on the client side
    // This simplifies the backend and allows for anonymous voting
    
    // Start a transaction to add the vote and update the wish vote count
    const { data: vote, error: voteError } = await supabase
      .from('wish_votes')
      .insert([
        {
          wish_id: wishId,
          user_id: user?.id || 'anonymous-' + Date.now(), // Use timestamp for anonymous users
        },
      ])
      .select();
    
    if (voteError) {
      console.error('Error adding vote:', voteError);
      return NextResponse.json({ error: voteError.message }, { status: 500 });
    }
    
    // Update the wish vote count
    const { data: updatedWish, error: updateError } = await supabase
      .rpc('increment_wish_votes', { wish_id: wishId })
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating wish vote count:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    
    return NextResponse.json(updatedWish, { status: 200 });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}
