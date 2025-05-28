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
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate required fields
    const { wishId } = body;
    if (!wishId) {
      return NextResponse.json(
        { error: 'Wish ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the user has already voted for this wish
    const { data: existingVote, error: voteCheckError } = await supabase
      .from('wish_votes')
      .select('*')
      .eq('wish_id', wishId)
      .eq('user_id', user.id)
      .single();
    
    if (voteCheckError && voteCheckError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is what we want
      console.error('Error checking existing vote:', voteCheckError);
      return NextResponse.json({ error: voteCheckError.message }, { status: 500 });
    }
    
    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this wish' },
        { status: 400 }
      );
    }
    
    // Start a transaction to add the vote and update the wish vote count
    const { data: vote, error: voteError } = await supabase
      .from('wish_votes')
      .insert([
        {
          wish_id: wishId,
          user_id: user.id,
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
