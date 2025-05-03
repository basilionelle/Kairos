'use client';

import { ClientWrapper } from '@/components/ClientWrapper';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/SupabaseProvider';

const SignInContent = () => {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup' | 'waitlist'>('signin');
  
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
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'waitlist') {
        // Submit to waitlist API
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.email.split('@')[0] // Use part of email as name
          }),
          cache: 'no-store',
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to join waitlist');
        }
        
        setIsSubmitted(true);
      } else if (mode === 'signin') {
        // Sign in with Supabase
        if (!formData.password) {
          setError('Password is required');
          setIsLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Redirect to dashboard on successful sign in
        router.push('/dashboard');
      } else if (mode === 'signup') {
        // Sign up with Supabase
        if (!formData.password) {
          setError('Password is required');
          setIsLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Show confirmation message
        setIsSubmitted(true);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main 
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #0a2463 0%, #3e92cc 100%)',
      }}
    >
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Column - Blue Background with Logo */}
        <div className="md:w-1/2 bg-blue-900 flex flex-col items-center justify-center p-8 text-white">
          <div className="max-w-md w-full">
            <Link href="/" className="inline-block mb-8">
              <h1 className="text-4xl font-bold text-white">Kairos</h1>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Welcome to Kairos</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              {mode === 'waitlist' ? 
                'Join our waitlist to get early access to our platform and be the first to know when we launch.' :
                mode === 'signup' ? 
                  'Create an account to get started with Kairos and unlock all features.' :
                  'Sign in to your account to access your dashboard and continue your journey.'}
            </p>
            <div className="hidden md:block">
              <img 
                src="/KAIROSBG.svg" 
                alt="Kairos Illustration" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Authentication Form */}
        <div className="md:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {mode === 'waitlist' ? 'Join Our Waitlist' : 
                     mode === 'signup' ? 'Create Account' : 'Sign In'}
                  </h2>
                  <p className="text-gray-600">
                    {mode === 'waitlist' ? 'Be the first to know about our updates' : 
                     mode === 'signup' ? 'Fill in your details to get started' : 'Welcome back!'}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="you@example.com"
                      disabled={isLoading}
                    />
                  </div>

                  {mode !== 'waitlist' && (
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 
                     mode === 'waitlist' ? 'Join Waitlist' : 
                     mode === 'signup' ? 'Sign Up' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                  {mode === 'signin' && (
                    <>
                      <p className="mb-2">
                        Don't have an account?{' '}
                        <button 
                          onClick={() => setMode('signup')} 
                          className="text-blue-600 hover:underline"
                        >
                          Sign up
                        </button>
                      </p>
                      <p>
                        Not ready to sign up?{' '}
                        <button 
                          onClick={() => setMode('waitlist')} 
                          className="text-blue-600 hover:underline"
                        >
                          Join waitlist
                        </button>
                      </p>
                    </>
                  )}
                  {mode === 'signup' && (
                    <>
                      <p className="mb-2">
                        Already have an account?{' '}
                        <button 
                          onClick={() => setMode('signin')} 
                          className="text-blue-600 hover:underline"
                        >
                          Sign in
                        </button>
                      </p>
                      <p>
                        Not ready to sign up?{' '}
                        <button 
                          onClick={() => setMode('waitlist')} 
                          className="text-blue-600 hover:underline"
                        >
                          Join waitlist
                        </button>
                      </p>
                    </>
                  )}
                  {mode === 'waitlist' && (
                    <p>
                      Already have an account?{' '}
                      <button 
                        onClick={() => setMode('signin')} 
                        className="text-blue-600 hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                {mode === 'waitlist' ? (
                  <p className="text-gray-600 text-sm sm:text-base">You've been added to our waitlist. We'll email you when access is available.</p>
                ) : (
                  <p className="text-gray-600 text-sm sm:text-base">Please check your email to confirm your account. You'll be able to sign in after confirmation.</p>
                )}
                
                <Link 
                  href="/" 
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
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
};

const SignInPage = () => {
  return (
    <ClientWrapper>
      <SignInContent />
    </ClientWrapper>
  );
};

export default SignInPage;
