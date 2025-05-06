import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Configure the route as dynamic to avoid static generation errors
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Fetch reviews for a specific app
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const appId = url.searchParams.get('app_id');
    
    if (!appId) {
      return NextResponse.json(
        { error: 'App ID is required' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    
    // Fetch reviews for the specified app
    const { data, error } = await supabase
      .from('app_reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('app_id', appId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching app reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch app reviews' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Add a new review
export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { app_id, rating, comment } = body;
    
    // Validate required fields
    if (!app_id || !rating) {
      return NextResponse.json(
        { error: 'App ID and rating are required' },
        { status: 400 }
      );
    }
    
    // Validate rating
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Check if app exists
    const { data: appData, error: appError } = await supabase
      .from('apps')
      .select('id')
      .eq('id', app_id)
      .single();
    
    if (appError || !appData) {
      return NextResponse.json(
        { error: 'App not found' },
        { status: 404 }
      );
    }
    
    // Check if user has already reviewed this app
    const { data: existingReview, error: existingReviewError } = await supabase
      .from('app_reviews')
      .select('id')
      .eq('app_id', app_id)
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (existingReview) {
      // Update existing review
      const { data, error } = await supabase
        .from('app_reviews')
        .update({
          rating: ratingNum,
          comment: comment || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingReview.id)
        .select();
      
      if (error) {
        console.error('Error updating review:', error);
        return NextResponse.json(
          { error: 'Failed to update review' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(data[0], { status: 200 });
    } else {
      // Create new review
      const { data, error } = await supabase
        .from('app_reviews')
        .insert([
          {
            app_id,
            user_id: session.user.id,
            rating: ratingNum,
            comment: comment || null
          }
        ])
        .select();
      
      if (error) {
        console.error('Error adding review:', error);
        return NextResponse.json(
          { error: 'Failed to add review' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(data[0], { status: 201 });
    }
  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a review
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const reviewId = url.searchParams.get('id');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get the review to check ownership
    const { data: review, error: reviewError } = await supabase
      .from('app_reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();
    
    if (reviewError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the owner of the review or an admin
    const isAdmin = session.user.app_metadata?.role === 'admin';
    const isOwner = review.user_id === session.user.id;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own reviews' },
        { status: 403 }
      );
    }
    
    // Delete the review
    const { error } = await supabase
      .from('app_reviews')
      .delete()
      .eq('id', reviewId);
    
    if (error) {
      console.error('Error deleting review:', error);
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
