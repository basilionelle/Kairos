'use client';

import { ClientWrapper } from '@/components/ClientWrapper';
import { useSupabase } from '@/components/SupabaseProvider';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function SignUpContent() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (authError) {
        throw new Error(authError.message || 'Registration failed');
      }
      
      // Create profile entry in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user?.id,
            full_name: formData.name,
            email: formData.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
      
      // Show success message
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
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
              Create an account to get started with Kairos and access your personalized student dashboard.
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

        {/* Right Column - Sign Up Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12"
        >
          <div className="max-w-md w-full">
            {!isSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Student Account</h2>
                  <p className="text-gray-600">Fill in your details to get started</p>
                </div>
                
                <div className="space-y-4">
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                  
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                        placeholder="Create a password"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                        placeholder="Confirm your password"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </motion.button>
                  </form>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                  <p className="mb-2">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-blue-700 hover:text-blue-800 font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
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
                  href="/signin" 
                  className="mt-4 inline-block text-blue-700 hover:text-blue-800 font-medium hover:underline"
                >
                  Return to Sign In
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

const SignUpPage = () => {
  return (
    <ClientWrapper>
      <SignUpContent />
    </ClientWrapper>
  );
};

export default SignUpPage;
