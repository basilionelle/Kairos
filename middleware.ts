import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  // Simple middleware for path-based routing
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all API routes except auth routes
    '/api/:path*',
  ],
};
