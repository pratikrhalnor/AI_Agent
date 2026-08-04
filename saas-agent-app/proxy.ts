import { authkitMiddleware } from '@workos-inc/authkit-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Exclude all auth-related paths from proxy
  const excludedPaths = [
    '/api',
    '/login',
    '/sign-in',
    '/sign-out',
    '/auth/callback',
    '/_next',
    '/favicon.ico',
  ];
  
  if (excludedPaths.some(path => pathname.startsWith(path) || pathname === path)) {
    return NextResponse.next();
  }
  
  // Exclude static assets
  if (pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js|webmanifest|json)$/)) {
    return NextResponse.next();
  }
  
  // Use AuthKit middleware for protected routes
  return authkitMiddleware()(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/integrations/:path*', 
    '/agent/:path*', 
    '/setting/:path*',
  ],
};