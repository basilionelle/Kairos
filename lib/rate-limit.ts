import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';
import { promisify } from 'util';

// Create a Map to store rate limit information
const rateLimitMap = new Map();

// Rate limit configuration
const limiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
};

// Rate limit middleware for Next.js API routes
export async function rateLimitMiddleware(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const ip = request.ip || '127.0.0.1';
  const key = `${ip}:${request.nextUrl.pathname}`;
  
  // Check if this IP has exceeded the rate limit
  const currentTime = Date.now();
  const rateData = rateLimitMap.get(key) || { count: 0, resetTime: currentTime + limiter.windowMs };
  
  // Reset count if the window has passed
  if (currentTime > rateData.resetTime) {
    rateData.count = 0;
    rateData.resetTime = currentTime + limiter.windowMs;
  }
  
  // Increment count
  rateData.count += 1;
  rateLimitMap.set(key, rateData);
  
  // Check if rate limit exceeded
  if (rateData.count > limiter.max) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    );
  }
  
  // Continue to the actual handler
  return handler(request);
}
