import { NextRequest, NextResponse } from 'next/server';
import { trackPageView, getAnalyticsSummary } from '@/lib/analytics';

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
    
    // Track the page view
    trackPageView({
      path,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      referrer,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json({ error: 'Failed to track analytics' }, { status: 500 });
  }
}

// API route to get analytics data
export async function GET() {
  try {
    const data = getAnalyticsSummary();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
