/**
 * Secure Cookie Management for Admin Sessions
 *
 * HTTPOnly, Secure, SameSite cookies
 * All error messages in Hebrew (RTL-first)
 */

const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 12 * 60 * 60; // 12 hours in seconds

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number;
  path?: string;
}

/**
 * Serialize cookie with secure options
 */
export function serializeCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    ...options,
  };

  let cookie = `${name}=${encodeURIComponent(value)}`;

  if (opts.maxAge) {
    cookie += `; Max-Age=${opts.maxAge}`;
  }

  if (opts.path) {
    cookie += `; Path=${opts.path}`;
  }

  if (opts.httpOnly) {
    cookie += '; HttpOnly';
  }

  if (opts.secure) {
    cookie += '; Secure';
  }

  if (opts.sameSite) {
    cookie += `; SameSite=${opts.sameSite}`;
  }

  return cookie;
}

/**
 * Parse cookies from request headers
 */
export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) {
    return {};
  }

  const cookies: Record<string, string> = {};

  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    const value = rest.join('=').trim();
    if (name && value) {
      cookies[name.trim()] = decodeURIComponent(value);
    }
  });

  return cookies;
}

/**
 * Get admin session token from cookies
 */
export function getSessionFromCookies(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  return cookies[COOKIE_NAME] || null;
}

/**
 * Set admin session cookie
 */
export function setSessionCookie(token: string): string {
  return serializeCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Clear admin session cookie (logout)
 */
export function clearSessionCookie(): string {
  return serializeCookie(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Get cookie name
 */
export function getCookieName(): string {
  return COOKIE_NAME;
}
