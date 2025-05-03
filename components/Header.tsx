'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Extend Window interface to include our custom properties
declare global {
  interface Window {
    lastClick?: number;
    clickCount?: number;
  }
}

const Header = () => {
  const [showAdmin, setShowAdmin] = useState(false);

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

  return (
    <header className="w-full py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10 flex justify-between items-center max-w-screen-xl mx-auto">
      <div 
        className="text-white font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight cursor-pointer" 
        onClick={handleLogoClick}
        aria-label="Kairos Logo"
      >
        Kairos
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        {showAdmin && (
          <Link 
            href="/analytics-dashboard" 
            className="text-white hover:text-blue-200 text-xs sm:text-sm font-medium transition-colors"
          >
            Analytics
          </Link>
        )}
        <Link 
          href="/signin" 
          className="bg-white text-kairos-primary px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-opacity-95 shadow-sm"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
};

export default Header;
