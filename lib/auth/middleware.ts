/**
 * Admin Authentication Middleware Helper
 *
 * Provides utilities for verifying admin authentication in API routes
 */

import { NextRequest } from 'next/server';
import { verifySessionToken } from './session';
import { unauthorizedResponse } from '../api/responses';

/**
 * Verify admin authentication from request
 * Returns session data if authenticated, null otherwise
 */
export function getAdminSession(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');

  if (!sessionCookie) {
    return null;
  }

  return verifySessionToken(sessionCookie.value);
}

/**
 * Check if request is authenticated as admin
 */
export function isAuthenticated(request: NextRequest): boolean {
  return getAdminSession(request) !== null;
}

/**
 * Require admin authentication or return 401 response
 * Usage: const session = requireAuth(request); if (!session) return unauthorizedResponse();
 */
export function requireAuth(request: NextRequest) {
  const session = getAdminSession(request);

  if (!session) {
    return null;
  }

  return session;
}

/**
 * Get authorization error response
 */
export function getAuthErrorResponse() {
  return unauthorizedResponse('נדרשת התחברות כמנהל');
}
