'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createClientSupabaseClient() {
  // Add fallback values for build time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-for-build.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build';
  
  // During runtime in the browser, environment variables will be properly injected
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
