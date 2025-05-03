import { ClientWrapper } from '@/components/ClientWrapper';

const SignInPage = () => {
  return (
    <ClientWrapper>
      <SignInContent />
    </ClientWrapper>
  );
};

export default SignInPage;

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function SignInContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  });
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Submit to our waitlist API endpoint with retry logic
      let retries = 2;
      let response;
      
      while (retries >= 0) {
        try {
          response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            // Add cache control to prevent caching issues
            cache: 'no-store',
          });
          break; // If successful, exit the retry loop
        } catch (fetchError) {
          console.warn(`Fetch attempt failed, retries left: ${retries}`, fetchError);
          if (retries === 0) throw fetchError;
          retries--;
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing response:', jsonError);
        throw new Error('Unable to process server response. Please try again.');
      }
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong with your submission. Please try again.');
      }
      
      console.log('Waitlist submission successful:', data);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Waitlist submission error:', err);
      setError(err.message || 'An error occurred while processing your request. Please try again later.');
    } finally {
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
      <div className="w-full py-4 sm:py-6 px-4 sm:px-6 md:px-10 flex justify-between items-center">
        <Link href="/" className="text-white text-3xl sm:text-4xl font-bold">Kairos</Link>
        <Link 
          href="/" 
          className="bg-white text-kairos-primary px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          Home
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1 items-center justify-center gap-y-8 md:gap-y-12 md:gap-x-16 px-4 sm:px-6 md:px-10 py-6 sm:py-10 max-w-6xl mx-auto">
        {/* Left side - Kairos logo */}
        <div className="flex items-center justify-center md:justify-end md:w-2/5">
          <h1 className="text-white text-5xl sm:text-6xl lg:text-7xl font-bold">Kairos</h1>
        </div>

        {/* Right side - Waitlist form */}
        <div className="w-full md:w-3/5 flex justify-center md:justify-start lg:justify-end md:pr-0 lg:pr-8 xl:pr-16">
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-8 w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px]">
            {!isSubmitted ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Join Waitlist</h2>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Be the first to know about our updates</p>
                
                <div className="space-y-6">
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-4 shadow-sm">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Failed to process your request</span>
                      </div>
                      <p className="mt-1 ml-7 text-sm">{error}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your name"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-md shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Join Waitlist'}
                    </button>
                  </form>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    We'll email you when access is available
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-6 sm:py-10">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 sm:h-12 w-10 sm:w-12 mx-auto text-green-500 mb-3 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Thank You!</h3>
                  <p className="text-gray-600 text-sm sm:text-base">You've been added to our waitlist. We'll email you when access is available.</p>
                </div>
                
                <Link 
                  href="/" 
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
                >
                  Return to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
