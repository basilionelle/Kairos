'use client';

import { useState, useEffect } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase-client';

export default function SupabaseDebug() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [envVariables, setEnvVariables] = useState<{url: string, keyPrefix: string}>({
    url: '',
    keyPrefix: ''
  });

  useEffect(() => {
    async function checkSupabaseConnection() {
      try {
        // Get environment variables (safely displaying only part of the key)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set';
        const keyPrefix = supabaseKey.substring(0, 10) + '...' + supabaseKey.substring(supabaseKey.length - 5);
        
        setEnvVariables({
          url: supabaseUrl,
          keyPrefix: keyPrefix
        });

        // Create Supabase client
        const supabase = createClientSupabaseClient();
        
        // Try a simple query to check connection
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' }).limit(1);
        
        if (error) {
          throw error;
        }
        
        setStatus('success');
      } catch (error: any) {
        setStatus('error');
        setErrorDetails(error.message || 'Unknown error occurred');
        console.error('Supabase connection error:', error);
      }
    }
    
    checkSupabaseConnection();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Status</h2>
      
      <div className="mb-4">
        <p><strong>Environment Variables:</strong></p>
        <ul className="list-disc pl-5 mt-2">
          <li>NEXT_PUBLIC_SUPABASE_URL: {envVariables.url}</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {envVariables.keyPrefix}</li>
        </ul>
      </div>
      
      <div className="mb-4">
        <p><strong>Connection Status:</strong></p>
        {status === 'loading' && (
          <div className="flex items-center mt-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <span>Testing connection...</span>
          </div>
        )}
        
        {status === 'success' && (
          <div className="mt-2 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            ✅ Connected to Supabase successfully
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            ❌ Failed to connect to Supabase
            <div className="mt-2 text-sm">
              <strong>Error:</strong> {errorDetails}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Troubleshooting Tips:</strong></p>
        <ul className="list-disc pl-5 mt-1">
          <li>Ensure environment variables are correctly set in Netlify</li>
          <li>Check if the Supabase project is active and accessible</li>
          <li>Verify that the anon key has the necessary permissions</li>
          <li>Check browser console for additional error details</li>
        </ul>
      </div>
    </div>
  );
}
