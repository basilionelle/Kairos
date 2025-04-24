import { NextRequest, NextResponse } from 'next/server';
import { trackPageView, getAnalyticsSummary } from '@/lib/analytics';

// Define PageView interface for type safety
interface PageView {
  path: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
}

// In-memory fallback for serverless environments
let memoryAnalytics: {
  pageViews: PageView[];
  lastReset: string;
} = {
  pageViews: [],
  lastReset: new Date().toISOString()
};

// Check if we're in a serverless environment where file operations might fail
const isServerless = process.env.NETLIFY || process.env.VERCEL;

// API route to track page views
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;
    
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }
    
    // Get IP address and user agent
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || '';
    
    const pageView = {
      path,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      referrer,
    };
    
    // If we're in a serverless environment, use in-memory storage
    if (isServerless) {
      // Add to in-memory storage
      memoryAnalytics.pageViews.push(pageView);
      
      // Keep only the last 1000 page views
      if (memoryAnalytics.pageViews.length > 1000) {
        memoryAnalytics.pageViews = memoryAnalytics.pageViews.slice(-1000);
      }
    } else {
      // Try to track using file system
      try {
        trackPageView(pageView);
      } catch (err) {
        console.error('File-based tracking failed, using memory fallback:', err);
        memoryAnalytics.pageViews.push(pageView);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 });
  }
}

// API route to get analytics data
export async function GET() {
  try {
    // If we're in a serverless environment, use in-memory data
    if (isServerless) {
      // Generate summary from memory
      const totalViews = memoryAnalytics.pageViews.length;
      
      // Count unique visitors based on IP
      const uniqueIPs = new Set(memoryAnalytics.pageViews.map(view => view.ip)).size;
      
      // Count views per page
      const viewsByPath = memoryAnalytics.pageViews.reduce((acc, view) => {
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
      
      return NextResponse.json({
        totalViews,
        uniqueVisitors: uniqueIPs,
        pageViews: pageViews.sort((a, b) => b.count - a.count),
        note: 'Using in-memory analytics (serverless mode)'
      });
    }
    
    // Try to get data from file system
    try {
      const data = getAnalyticsSummary();
      return NextResponse.json(data);
    } catch (err) {
      console.error('File-based analytics failed, using memory fallback:', err);
      
      // Fallback to memory data
      return NextResponse.json({
        totalViews: memoryAnalytics.pageViews.length,
        uniqueVisitors: new Set(memoryAnalytics.pageViews.map(view => view.ip)).size,
        pageViews: [],
        note: 'Using fallback analytics (file access failed)'
      });
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
