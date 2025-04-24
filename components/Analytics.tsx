'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Simple analytics component that can be used with various analytics providers
export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track page views when route changes
  useEffect(() => {
    if (pathname) {
      const url = searchParams.size > 0 
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      
      // Track page view with our custom API
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: url }),
      }).catch(error => {
        // Silently fail - we don't want analytics to break the site
        console.error('Analytics error:', error);
      });
      
      // Check if umami is loaded (external analytics)
      if (typeof window !== 'undefined' && window.umami) {
        window.umami.trackView(url);
      }
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Umami Analytics Script - Replace YOUR_WEBSITE_ID with your actual ID when you set up umami */}
      <Script
        async
        src="https://analytics.umami.is/script.js"
        data-website-id="YOUR_WEBSITE_ID"
        strategy="afterInteractive"
      />
    </>
  );
}

// Add TypeScript declaration for the umami global object
declare global {
  interface Window {
    umami?: {
      trackView: (url: string) => void;
      trackEvent: (eventName: string, eventData?: any) => void;
    };
  }
}
