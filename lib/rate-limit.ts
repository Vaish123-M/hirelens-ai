import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from './auth-utils';

export interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
  skipSuccessfulRequests?: boolean;
}

export function rateLimit(options: RateLimitOptions = {}) {
  const {
    maxRequests = 5,
    windowMs = 15 * 60 * 1000, // 15 minutes
    skipSuccessfulRequests = false,
  } = options;

  return async function rateLimitMiddleware(request: NextRequest) {
    const ip = getClientIp(request);
    const identifier = `rate_limit:${ip}:${request.nextUrl.pathname}`;
    
    const result = checkRateLimit(identifier, maxRequests, windowMs);
    
    if (!result.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests', 
          message: `Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds`,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
    
    return response;
  };
}

// Specific rate limiters for different endpoints
export const authRateLimit = rateLimit({ maxRequests: 5, windowMs: 15 * 60 * 1000 }); // 5 requests per 15 minutes
export const passwordResetRateLimit = rateLimit({ maxRequests: 3, windowMs: 60 * 60 * 1000 }); // 3 requests per hour
export const emailVerificationRateLimit = rateLimit({ maxRequests: 3, windowMs: 60 * 60 * 1000 }); // 3 requests per hour
export const generalApiRateLimit = rateLimit({ maxRequests: 100, windowMs: 15 * 60 * 1000 }); // 100 requests per 15 minutes
