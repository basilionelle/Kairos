'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    lastClick?: number;
    clickCount?: number;
  }
}

const Header = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
        <Link 
          href="/marketplace-upload" 
          className="text-white hover:text-white/90 px-3 py-2 text-sm font-medium transition-all"
        >
          Upload Tool
        </Link>
        <Link 
          href="/signin" 
          className="bg-white text-kairos-primary px-4 py-1.5 rounded-full text-sm font-medium hover:bg-opacity-95 transition-all shadow-sm ml-2"
        >
          Sign in
        </Link>
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
            <Link 
              href="/signin" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign in
            </Link>
          </div>
        </div>
      )}

      {/* Hidden admin panel that appears with triple-click */}
      {showAdmin && (
        <div className="absolute top-full right-6 md:right-10 mt-2 bg-white p-4 rounded-lg shadow-lg z-50">
          <h3 className="text-lg font-semibold mb-2">Admin Links</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/analytics-dashboard" 
                className="text-blue-600 hover:underline"
              >
                Analytics Dashboard
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
