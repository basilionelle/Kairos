import { createClient } from '@supabase/supabase-js';

// Add fallback values for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-for-build.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build';

// Only throw error in development, not during build
if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key (for admin operations)
export const createServerSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key-for-build';
  
  // Only throw error in development, not during build
  if (process.env.NODE_ENV === 'development' && !supabaseServiceKey) {
    console.warn('Missing Supabase service role key');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};
