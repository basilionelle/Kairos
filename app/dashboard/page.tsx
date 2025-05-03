'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '@/components/SupabaseProvider';
import { ClientWrapper } from '@/components/ClientWrapper';

const DashboardContent = () => {
  const router = useRouter();
  const { supabase, user, loading } = useSupabase();
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (!loading && !user) {
        // Redirect to sign in if no user
        router.push('/signin');
      } else if (user) {
        // Fetch user profile
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setProfile(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    checkSession();
  }, [user, loading, router, supabase]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      router.push('/');
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Kairos
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {profile?.full_name || user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-medium text-blue-800 mb-4">Your Profile</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">University</p>
                    <p className="font-medium">{profile?.university || 'Not set'}</p>
                  </div>
                  <div className="pt-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm">No recent activity to display.</p>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 shadow-sm text-white">
                <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/marketplace" className="block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors">
                    Browse Marketplace
                  </Link>
                  <Link href="/analytics" className="block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors">
                    View Analytics
                  </Link>
                  <button className="w-full text-left px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors">
                    Update Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <ClientWrapper>
      <DashboardContent />
    </ClientWrapper>
  );
};

export default DashboardPage;
