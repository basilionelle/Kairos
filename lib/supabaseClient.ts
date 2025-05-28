import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to subscribe to real-time changes
export const subscribeToWishes = (callback: (payload: any) => void) => {
  const channel = supabase
    .channel('wishes-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'wishes',
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Helper function to subscribe to wish votes
export const subscribeToWishVotes = (callback: (payload: any) => void) => {
  const channel = supabase
    .channel('wish-votes-channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'wish_votes',
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
