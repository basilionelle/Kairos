import { NextRequest, NextResponse } from 'next/server';
import { csrf } from 'next-csrf';

// CSRF protection middleware
const { csrf: csrfMiddleware } = csrf({
  secret: process.env.NEXTAUTH_SECRET || 'your-csrf-secret',
  cookieName: 'kairos-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  },
});

export default async function middleware(request: NextRequest) {
  // Apply CSRF protection to all POST, PUT, DELETE requests
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    // Skip CSRF for API routes that use other security mechanisms
    if (request.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }
    
    return csrfMiddleware(request);
  }
  
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all API routes except auth routes
    '/api/:path*',
  ],
};
