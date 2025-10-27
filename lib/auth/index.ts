/**
 * Admin Authentication - Central Export
 *
 * Single password gate with HMAC sessions
 * No user accounts, no OAuth
 * All error messages in Hebrew (RTL-first)
 */

export * from './session';
export * from './cookies';
export * from './rate-limit';

/**
 * Check if user is authenticated from request
 */
import { verifySessionToken } from './session';
import { getSessionFromCookies } from './cookies';

export function isAuthenticated(request: Request): boolean {
  const token = getSessionFromCookies(request);
  if (!token) {
    return false;
  }

  const sessionData = verifySessionToken(token);
  return sessionData !== null;
}

/**
 * Get session data from request
 */
export function getSession(request: Request) {
  const token = getSessionFromCookies(request);
  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}
