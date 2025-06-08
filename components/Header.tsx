'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSupabase } from '@/components/SupabaseProvider'
import type { Session } from '@supabase/supabase-js'
import  SignInButton  from '@/components/SignInButton';

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    lastClick?: number;
    clickCount?: number;
  }
}

function SignInMobile({isLoggedIn, setMobileMenuOpen} : {isLoggedIn : Session | null, setMobileMenuOpen : Function}) {
  if (isLoggedIn) {
    return <Link 
              href="/dashboard" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>;
  }
  return <Link 
              href="/signin" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>;
}

function MarketplaceLink({isLoggedIn} : {isLoggedIn : Session | null}) {
  if (isLoggedIn) {
    return <Link 
          href="/marketplace-upload" 
          className="text-white hover:text-white/90 px-3 py-2 text-sm font-medium transition-all"
        >
          Upload Tool
        </Link>
  } else {
    return null;
  }
}

function MarketplaceLinkMobile({isLoggedIn, setMobileMenuOpen} : {isLoggedIn : Session | null, setMobileMenuOpen : Function}) {
  if (isLoggedIn) {
    return <Link 
              href="/marketplace-upload" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload Tool
            </Link>
  } else {
    return null;
  }
}

const Header = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Initialize window properties
  useEffect(() => {
    window.clickCount = 0;
    window.lastClick = 0;
    
    return () => {
      // Clean up when component unmounts
      delete window.clickCount;
      delete window.lastClick;
    };
  }, []);

  // Toggle admin panel visibility with triple-click on logo
  const handleLogoClick = () => {
    const now = Date.now();
    if (!window.lastClick || now - window.lastClick > 500) {
      window.clickCount = 1;
    } else {
      window.clickCount = (window.clickCount || 0) + 1;
    }
    window.lastClick = now;

    if ((window.clickCount || 0) >= 3) {
      setShowAdmin(prev => !prev);
      window.clickCount = 0;
    }
  };

  // Handle clicks outside of mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10 flex justify-between items-center max-w-screen-xl mx-auto relative z-30">
      {/* Logo - with triple-click for admin */}
      <div 
        className="text-white font-bold text-3xl sm:text-4xl tracking-tight" 
        onClick={handleLogoClick}
      >
        Kairos
      </div>
      
      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <Link 
          href="/" 
          className="text-white hover:text-white/90 px-3 py-2 text-sm font-medium transition-all"
        >
          Home
        </Link>
        <Link 
          href="/marketplace" 
          className="text-white hover:text-white/90 px-3 py-2 text-sm font-medium transition-all"
        >
          Marketplace
        </Link>
        <MarketplaceLink isLoggedIn={session} />
        <Link 
          href="/wishlist" 
          className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Wishlist
        </Link>
        <SignInButton></SignInButton>
        <button 
            onClick={() => setShowContactPopup(true)}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all shadow-sm"
          >
            Contact Us
          </button>
      </div>

      {/* Mobile menu button */}
      <button 
        className="md:hidden text-white p-2 focus:outline-none"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out"
        >
          <div className="py-1">
            <Link 
              href="/" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/marketplace" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <MarketplaceLinkMobile isLoggedIn={session} setMobileMenuOpen={setMobileMenuOpen} />
            <Link 
              href="/wishlist" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                Wishlist
              </span>
            </Link>
            <SignInMobile isLoggedIn={session} setMobileMenuOpen={setMobileMenuOpen} />

            <Link 
              href="#" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {setShowContactPopup(true); setMobileMenuOpen(false)}}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}

      
{/* Contact Popup */}
      {showContactPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setShowContactPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Email: </span>
                <a href="mailto:moodevelopers@gmail.com" className="ml-2 text-blue-600 dark:text-blue-400 hover:underline">moodevelopers@gmail.com</a>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l.66 1.6L9.1 8.66 15 14l6.1-5.34.66 1.6-6.76 5.92L9.1 10.34 3 15.92V10z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">Instagram: </span>
                <a href="https://instagram.com/kairos__ph" target="_blank" rel="noopener noreferrer" className="ml-2 text-pink-600 dark:text-pink-400 hover:underline">@kairos__ph</a>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </header>

  );
  
};

export default Header;
