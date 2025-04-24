'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PageView {
  path: string;
  timestamp: string;
  referrer?: string;
}

interface AnalyticsData {
  pageViews: PageView[];
  lastCleared: string;
}

// Initialize analytics in localStorage
const initAnalytics = (): AnalyticsData => {
  if (typeof window === 'undefined') return { pageViews: [], lastCleared: new Date().toISOString() };
  
  try {
    const stored = localStorage.getItem('kairos_analytics');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading analytics from localStorage:', e);
  }
  
  const newData = { pageViews: [], lastCleared: new Date().toISOString() };
  try {
    localStorage.setItem('kairos_analytics', JSON.stringify(newData));
  } catch (e) {
    console.error('Error writing to localStorage:', e);
  }
  
  return newData;
};

// Save analytics to localStorage
const saveAnalytics = (data: AnalyticsData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('kairos_analytics', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving analytics to localStorage:', e);
  }
};

// Track a page view
const trackPageView = (path: string, referrer?: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const analytics = initAnalytics();
    
    // Add the new page view
    analytics.pageViews.push({
      path,
      timestamp: new Date().toISOString(),
      referrer: referrer || document.referrer || undefined,
    });
    
    // Limit to last 1000 page views to prevent localStorage from growing too large
    if (analytics.pageViews.length > 1000) {
      analytics.pageViews = analytics.pageViews.slice(-1000);
    }
    
    saveAnalytics(analytics);
  } catch (e) {
    console.error('Error tracking page view:', e);
  }
};

// Get analytics summary
export const getAnalyticsSummary = () => {
  if (typeof window === 'undefined') {
    return {
      totalViews: 0,
      uniquePaths: 0,
      pageViews: [],
    };
  }
  
  try {
    const analytics = initAnalytics();
    
    // Count total page views
    const totalViews = analytics.pageViews.length;
    
    // Count views per page
    const viewsByPath = analytics.pageViews.reduce((acc, view) => {
      const path = view.path || 'unknown';
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Format for display
    const pageViews = Object.entries(viewsByPath).map(([path, count]) => ({
      path,
      count,
      timestamp: new Date().toISOString().split('T')[0],
    }));
    
    return {
      totalViews,
      uniquePaths: Object.keys(viewsByPath).length,
      pageViews: pageViews.sort((a, b) => b.count - a.count),
    };
  } catch (e) {
    console.error('Error getting analytics summary:', e);
    return {
      totalViews: 0,
      uniquePaths: 0,
      pageViews: [],
    };
  }
};

// Clear all analytics data
export const clearAnalytics = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    saveAnalytics({
      pageViews: [],
      lastCleared: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Error clearing analytics:', e);
  }
};

// Client analytics component
export function ClientAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Track page views when route changes
  useEffect(() => {
    if (pathname) {
      const url = searchParams.size > 0 
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        trackPageView(url);
      }, 100);
    }
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
