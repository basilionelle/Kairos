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
      <div className="w-full py-6 px-6 md:px-10 flex justify-between items-center">
        <Link href="/" className="text-white text-4xl font-bold">Kairos</Link>
        <Link 
          href="/" 
          className="bg-white text-kairos-primary px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          Home
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1 items-center justify-center gap-y-12 md:gap-x-16 px-6 md:px-10 py-10 max-w-6xl mx-auto">
        {/* Left side - Kairos logo */}
        <div className="flex items-center justify-center md:justify-end md:w-2/5">
          <h1 className="text-white text-6xl lg:text-7xl font-bold">Kairos</h1>
        </div>

        {/* Right side - Waitlist form */}
        <div className="w-full md:w-3/5 flex justify-center md:justify-end pr-8 lg:pr-16">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-[480px]">
            {!isSubmitted ? (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Waitlist</h2>
                <p className="text-gray-600 mb-6">Be the first to know about our updates</p>
                
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
                  
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-6 py-4 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kairos-primary focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-6 py-4 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kairos-primary focus:border-transparent"
                        placeholder="Email address"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#f7931a] hover:bg-[#e68619] text-white font-medium py-4 px-6 text-lg rounded-md transition-colors duration-200"
                    >
                      {isLoading ? 'Submitting...' : 'Join Waitlist'}
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
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">You're on the list!</h2>
                <p className="text-gray-600 mb-6">Thank you for your interest in Kairos</p>
                <p className="text-sm text-gray-500 mb-4">We'll email you at <span className="font-medium">{formData.email}</span> when access is available.</p>
                <Link 
                  href="/" 
                  className="inline-block bg-kairos-primary text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-kairos-primary/90 transition-colors"
                >
                  Return Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
