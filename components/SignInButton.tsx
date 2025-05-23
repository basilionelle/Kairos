import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import type { Session } from '@supabase/supabase-js'
import Link from 'next/link';

export default function SignInButton() {
  const [session, setSession] = useState<Session | null>(null)
  const { supabase } = useSupabase();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return session ? (
    <Link 
            href="/dashboard" 
            className="bg-white text-kairos-primary dark:text-kairos-dark px-4 py-1.5 rounded-full text-sm font-medium hover:bg-opacity-95 transition-all shadow-sm"
          >
            Dashboard
          </Link>
  ) : (
    <Link 
            href="/signin" 
            className="bg-white text-kairos-primary dark:text-kairos-dark px-4 py-1.5 rounded-full text-sm font-medium hover:bg-opacity-95 transition-all shadow-sm"
          >
            Sign in
          </Link>
  )
}
