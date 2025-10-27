/**
 * Next.js Middleware - Admin Route Protection
 *
 * Protects /admin/* and /api/admin/* routes with session verification
 * All error messages in Hebrew (RTL-first)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSessionValid } from '@/lib/auth/edge-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page and auth API routes
  // Also allow seed endpoints in development
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/auth/') ||
    (pathname.includes('/seed') && process.env.NODE_ENV === 'development')
  ) {
    return NextResponse.next();
  }

  // Get session cookie
  const sessionCookie = request.cookies.get('admin_session');
  const isValid = await isSessionValid(sessionCookie?.value);

  // If not authenticated, redirect to login
  if (!isValid) {
    // For API routes, return 401
    if (pathname.startsWith('/api/admin/')) {
      return NextResponse.json(
        { error: 'נדרשת התחברות כמנהל' },
        { status: 401 }
      );
    }

    // For admin pages, redirect to login
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow authenticated requests
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all admin routes except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
