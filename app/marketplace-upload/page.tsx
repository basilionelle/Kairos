'use client';

import { ClientWrapper } from '@/components/ClientWrapper';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { useRouter } from 'next/navigation';

function UploadContent() {
  const router = useRouter();
  const { supabase, user, loading } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    university: '',
    icon: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
      const checkSession = async () => {
        if (!loading && !user) {
          // Redirect to sign in if no user
          router.push('/signin');
        } 
        else if (user) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, files } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] || null : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // console.log(formData);

    // Basic validation
    if (!formData.name || !formData.description || !formData.link || !formData.university || !formData.icon) {
      setError('All fields are required');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('link', formData.link);
    form.append('university', formData.university);
    form.append('icon', formData.icon);
    
    setIsLoading(true);
    
    try {
      // Send registration data to our API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: form
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      } else {
        // redirect('/marketplace');
        router.push('/marketplace');
      }
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
      setIsLoading(false);
    }
  };

  return (
    <main 
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{
        backgroundImage: 'url(/images/KAIROSBG.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#4362d5'
      }}
    >
      {/* Top navigation */}
      <div className="w-full py-6 px-6 md:px-10 flex justify-between items-center">
        <Link href="/" className="text-white text-4xl font-bold">Kairos</Link>
      </div>

      {/* Main content */}
      <div className="flex flex-col align-top md:flex-row flex-1 gap-y-12 md:gap-x-10 px-6 md:px-10 py-10 max-w-6xl mx-auto">
        {/* Left side - Kairos logo */}
        <div className="flex-col items-center justify-center md:justify-end">
          <div className="mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
                    <span className="block mb-1 text-white/95">Submit a Tool</span>
                </h1>
                </div>
                
                <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 md:mb-10 text-white/85">Join 120+ student developers building for students</p>

                <img 
            src="/images/LANDING.svg" 
            alt="Kairos App Interface" 
            style={{
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))',
              willChange: 'transform',
            }}
            loading="eager"
          />
        </div>

        {/* Right side - Sign up form */}
        <div className="w-full md:w-3/5 flex justify-center md:justify-end pr-8 lg:pr-16">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-[480px]">
            {/* <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h2> */}
            
            <div className="space-y-6">
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form className="space-y-5 justify-around flex-col" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Tool Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                      placeholder=""
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description*
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                      placeholder=""
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                      Tool Link (GitHub or Hosted Site)*
                    </label>
                    <input
                      type="url"
                      id="link"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                      placeholder=""
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                      University*
                    </label>
                    <select
                      id="university"
                      name="university"
                      value={formData.university}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      <option value=""></option>
                      <option value="DLSU">De La Salle University</option>
                      <option value="ADMU">Ateneo De Manila</option>
                      <option value="UP">University of the Philippines</option>
                      <option value="UST">University of Santo Tomas</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                      App Icon*
                    </label>
                    <input
                      type="file"
                      id="icon"
                      name="icon"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                      placeholder=""
                      disabled={isLoading}
                    />
                  </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#f7931a] hover:bg-[#e68619] text-white font-medium py-4 px-6 text-lg rounded-md transition-colors duration-200"
                >
                  {isLoading ? 'Uploading Tool...' : 'Upload Tool'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const UploadPage = () => {
  return (
    <ClientWrapper>
      <UploadContent />
    </ClientWrapper>
  );
};

export default UploadPage;