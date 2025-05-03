'use client';

import { ClientWrapper } from '@/components/ClientWrapper';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

function SignUpContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

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
      // Send registration data to our API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Redirect to sign-in page after successful registration
      signIn(undefined, { callbackUrl: '/signin' });
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
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
          href="/signin" 
          className="bg-white text-kairos-primary px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          Sign in
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1 items-center justify-center gap-y-12 md:gap-x-16 px-6 md:px-10 py-10 max-w-6xl mx-auto">
        {/* Left side - Kairos logo */}
        <div className="flex items-center justify-center md:justify-end md:w-2/5">
          <h1 className="text-white text-6xl lg:text-7xl font-bold">Kairos</h1>
        </div>

        {/* Right side - Sign up form */}
        <div className="w-full md:w-3/5 flex justify-center md:justify-end pr-8 lg:pr-16">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-[480px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h2>
            
            <div className="space-y-6">
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
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
                    placeholder="Full Name"
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

                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-6 py-4 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kairos-primary focus:border-transparent"
                    placeholder="Password"
                  />
                </div>
                
                <div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-6 py-4 text-lg rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-kairos-primary focus:border-transparent"
                    placeholder="Confirm Password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#f7931a] hover:bg-[#e68619] text-white font-medium py-4 px-6 text-lg rounded-md transition-colors duration-200"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/signin" className="text-kairos-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
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
