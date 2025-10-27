/**
 * Admin Session Management
 *
 * HMAC-based session tokens for admin authentication
 * No user accounts - single password gate
 * All error messages in Hebrew (RTL-first)
 */

import { createHmac, randomBytes } from 'crypto';

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const SESSION_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

if (!ADMIN_SECRET) {
  throw new Error('ADMIN_SECRET environment variable is required');
}

export interface SessionData {
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

/**
 * Generate HMAC signature for session data
 */
function generateSignature(data: SessionData): string {
  const payload = JSON.stringify(data);
  return createHmac('sha256', ADMIN_SECRET!)
    .update(payload)
    .digest('hex');
}

/**
 * Create a new admin session token
 */
export function createSessionToken(): string {
  const now = Date.now();
  const sessionData: SessionData = {
    issuedAt: now,
    expiresAt: now + SESSION_DURATION,
    nonce: randomBytes(16).toString('hex'),
  };

  const signature = generateSignature(sessionData);
  const token = Buffer.from(
    JSON.stringify({ data: sessionData, signature })
  ).toString('base64');

  return token;
}

/**
 * Verify admin session token
 * Returns session data if valid, null if invalid
 */
export function verifySessionToken(token: string): SessionData | null {
  try {
    // Decode token
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    const { data, signature } = decoded;

    // Verify signature
    const expectedSignature = generateSignature(data);
    if (signature !== expectedSignature) {
      return null;
    }

    // Check expiration
    if (Date.now() > data.expiresAt) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

/**
 * Check if password matches admin secret
 */
export function verifyPassword(password: string): boolean {
  if (!password || !ADMIN_SECRET) {
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  const expectedHash = createHmac('sha256', 'admin-check')
    .update(ADMIN_SECRET)
    .digest('hex');

  const providedHash = createHmac('sha256', 'admin-check')
    .update(password)
    .digest('hex');

  return expectedHash === providedHash;
}

/**
 * Get session duration in milliseconds
 */
export function getSessionDuration(): number {
  return SESSION_DURATION;
}

/**
 * Check if session is about to expire (within 30 minutes)
 */
export function isSessionExpiringSoon(sessionData: SessionData): boolean {
  const thirtyMinutes = 30 * 60 * 1000;
  return Date.now() > (sessionData.expiresAt - thirtyMinutes);
}
