# Kairos Wishlist Real-Time Setup

This guide explains how to set up the real-time wishlist functionality in Kairos, ensuring that new wishes appear immediately for all users viewing the Kairos webpage.

## Database Setup

The wishlist feature requires two tables in your Supabase database:
1. `wishes` - Stores all wishes submitted by users
2. `wish_votes` - Tracks votes on wishes

### Running Migrations

A migration file has been created at `supabase/migrations/20250528_create_wishlist_tables.sql`. To apply this migration:

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the migration file and paste it into a new SQL query
4. Run the query to create the necessary tables, functions, and policies

Alternatively, if you're using the Supabase CLI:

```bash
supabase db push
```

## Environment Setup

Ensure your environment variables are properly configured:

1. Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. These variables should also be configured in your Netlify deployment settings.

## Real-Time Functionality

The real-time functionality is implemented using Supabase's real-time subscriptions. The key components are:

1. `lib/supabaseClient.ts` - Client-side Supabase client with real-time configuration
2. `components/wishlist/WishlistFeed.tsx` - Subscribes to real-time updates for wishes and votes
3. `components/wishlist/WishlistSubmission.tsx` - Submits new wishes to the API
4. `app/api/wishes/route.ts` - API endpoint for creating and fetching wishes
5. `app/api/wishes/vote/route.ts` - API endpoint for voting on wishes

### How It Works

1. When a user submits a new wish, it's sent to the API endpoint
2. The API endpoint inserts the wish into the Supabase database
3. Supabase broadcasts the change to all connected clients via real-time subscriptions
4. The WishlistFeed component receives the update and adds the new wish to the UI
5. Similarly, votes are processed in real-time

## Testing Real-Time Functionality

To test if the real-time functionality is working:

1. Open the Kairos website in two different browsers or devices
2. Submit a new wish from one browser
3. The new wish should appear immediately in the other browser without refreshing
4. Vote on a wish in one browser, and the vote count should update in real-time on the other browser

## Troubleshooting

If real-time updates are not working:

1. Check the browser console for errors
2. Verify that your Supabase project has real-time enabled (it's enabled by default)
3. Ensure the tables are added to the real-time publication with:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE wishes;
   ALTER PUBLICATION supabase_realtime ADD TABLE wish_votes;
   ```
4. Verify that your environment variables are correctly set
5. Check that users are properly authenticated when submitting wishes or votes

## Security Considerations

The implementation includes Row Level Security (RLS) policies to ensure:

1. Anyone can read wishes and votes
2. Only authenticated users can submit wishes and votes
3. Users can only update their own wishes

These policies are automatically applied when you run the migration script.
