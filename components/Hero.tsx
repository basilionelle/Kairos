'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const Hero = () => {
  // Add state to detect if we're on a mobile device
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on a mobile device or if the browser is having performance issues
  useEffect(() => {
    // Check for mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Run on mount and when window resizes
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center min-h-[calc(100vh-120px)] px-4 md:px-8 py-8 gap-8 md:gap-16 max-w-screen-xl mx-auto">
      {/* Left side - App illustration - optimized for performance */}
      <div className="w-full xl:w-3/5 relative flex justify-center">
        {/* Main image container - simplified for better performance */}
        <div className="relative w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
          <img 
            src="/images/LANDING.svg" 
            alt="Kairos App Interface" 
            className={`w-full h-auto object-contain ${isMobile ? '' : 'animate-float-gentle'}`}
            style={{
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))',
              willChange: 'transform',
            }}
            loading="eager"
          />
        </div>
        
        {/* Decorative elements - only shown on larger screens for performance */}
        {!isMobile && (
          <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden hidden md:block">
            <div className="absolute top-1/4 left-1/5 w-6 h-6 bg-yellow-300 rounded-full opacity-30"></div>
            <div className="absolute top-3/4 left-1/3 w-4 h-4 bg-white rounded-full opacity-20"></div>
            <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-kairos-accent rounded-full opacity-40"></div>
            <div className="absolute bottom-1/3 right-1/3 w-5 h-5 bg-white rounded-full opacity-30"></div>
          </div>
        )}
      </div>
      
      {/* Right side - Text content with improved hierarchy and mobile optimization */}
      <div className="w-full xl:w-2/5 text-white pt-4 md:pt-8 xl:pt-0 text-center xl:text-left">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
            <span className="block mb-1">The Student-Powered</span>
            <span className="block text-white/95">Toolkit</span>
            <span className="block bg-gradient-to-r from-white to-white/80 text-transparent bg-clip-text">for College Success</span>
          </h1>
        </div>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-10 text-white/85">
          Explore Kairos Today!
        </p>
        <Link 
          href="/marketplace" 
          className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg shadow-lg"
        >
          Explore Kairos
        </Link>
      </div>
    </div>
  );
};

export default Hero;
