'use client';

import { ClientWrapper } from '@/components/ClientWrapper';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/SupabaseProvider';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import the debug component to avoid SSR issues with environment variables
const SupabaseDebug = dynamic(() => import('@/components/SupabaseDebug'), { ssr: false });

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
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
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
      if (mode === 'signin') {
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
      } else if (mode === 'reset') {
        // Password reset with Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/auth/callback?reset=true`,
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Show confirmation message
        setResetEmailSent(true);
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
        background: '#0a2463',
      }}
    >
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Column - Blue Background with Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:w-1/2 bg-blue-900 flex flex-col items-center justify-center p-8 md:p-12 text-white"
        >
          <div className="max-w-md w-full">
            <Link href="/" className="inline-block mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white">Kairos</h1>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Welcome to Kairos</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              {mode === 'signup' ? 
                'Create an account to get started with Kairos and access your personalized student dashboard.' :
                mode === 'reset' ? 
                'Reset your password to regain access to your account.' :
                'Sign in to your account to access your personalized student dashboard and continue your journey.'}
            </p>
            <div className="hidden md:block">
              <img 
                src="/KAIROSBG.svg" 
                alt="Kairos Illustration" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </motion.div>

        {/* Right Column - Authentication Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12"
        >
          <div className="max-w-md w-full">
            {!isSubmitted && !resetEmailSent ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {mode === 'signup' ? 'Create Student Account' : mode === 'reset' ? 'Reset Password' : 'Student Sign In'}
                  </h2>
                  <p className="text-gray-600">
                    {mode === 'signup' ? 'Fill in your details to get started' : 
                     mode === 'reset' ? 'Enter your email to reset your password' : 'Welcome back!'}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                    
                    {/* Show debug component if there's a fetch error */}
                    {error.toLowerCase().includes('fetch') && (
                      <div className="mt-4 pt-4 border-t border-red-300">
                        <p className="font-medium mb-2">Connection Diagnostics:</p>
                        <SupabaseDebug />
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                      placeholder="you@example.com"
                      disabled={isLoading}
                    />
                  </div>

                  {mode !== 'reset' && (
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                        placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 
                     mode === 'signup' ? 'Sign Up' : 
                     mode === 'reset' ? 'Send Reset Link' : 'Sign In'}
                  </motion.button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                  {mode === 'signin' && (
                    <>
                      <p className="mb-2">
                        Don't have an account?{' '}
                        <button 
                          onClick={() => setMode('signup')} 
                          className="text-blue-700 hover:text-blue-800 font-medium hover:underline"
                        >
                          Sign up
                        </button>
                      </p>
                      <p className="mb-2">
                        <button 
                          onClick={() => setMode('reset')} 
                          className="text-blue-700 hover:text-blue-800 font-medium hover:underline"
                        >
                          Forgot your password?
                        </button>
                      </p>
                    </>
                  )}
                  {mode === 'reset' && (
                    <p className="mb-2">
                      Remember your password?{' '}
                      <button 
                        onClick={() => setMode('signin')} 
                        className="text-blue-700 hover:text-blue-800 font-medium hover:underline"
                      >
                        Back to sign in
                      </button>
                    </p>
                  )}
                </div>
              </>
            ) : resetEmailSent ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Password Reset Email Sent</h3>
                <p className="text-gray-600 text-sm sm:text-base">Please check your email for a link to reset your password. If you don't see it, check your spam folder.</p>
                
                <button 
                  onClick={() => {
                    setResetEmailSent(false);
                    setMode('signin');
                  }}
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
                >
                  Return to Sign In
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600 text-sm sm:text-base">Please check your email to confirm your account. You'll be able to sign in after confirmation.</p>
                
                <Link 
                  href="/" 
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
                >
                  Return to Home
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
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
