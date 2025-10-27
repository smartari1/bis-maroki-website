/**
 * Rate Limiting for Admin Login
 *
 * Prevents brute-force attacks
 * 5 attempts per 10 minutes per IP
 * All error messages in Hebrew (RTL-first)
 */

interface RateLimitEntry {
  attempts: number;
  firstAttemptAt: number;
  blockedUntil?: number;
}

// In-memory store (for production, consider Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '5');
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '600000'); // 10 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Get client identifier (IP address or deployment URL for preview)
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from headers (Vercel/CloudFlare)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0] || 'unknown';

  // For preview deployments, use deployment URL to avoid false positives
  const host = request.headers.get('host') || '';
  if (host.includes('vercel.app')) {
    return `preview-${host}`;
  }

  return ip;
}

/**
 * Check if client is rate limited
 * Returns { allowed: boolean, remainingAttempts: number, resetAt: number }
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  resetAt: number;
  blockedUntil?: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No previous attempts
  if (!entry) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - 1,
      resetAt: now + WINDOW_MS,
    };
  }

  // Check if currently blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetAt: entry.blockedUntil,
      blockedUntil: entry.blockedUntil,
    };
  }

  // Check if window has expired
  if (now - entry.firstAttemptAt > WINDOW_MS) {
    // Reset window
    rateLimitStore.delete(identifier);
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - 1,
      resetAt: now + WINDOW_MS,
    };
  }

  // Check if max attempts reached
  if (entry.attempts >= MAX_ATTEMPTS) {
    const blockedUntil = now + BLOCK_DURATION_MS;
    entry.blockedUntil = blockedUntil;
    rateLimitStore.set(identifier, entry);

    return {
      allowed: false,
      remainingAttempts: 0,
      resetAt: blockedUntil,
      blockedUntil,
    };
  }

  // Still within limits
  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - entry.attempts,
    resetAt: entry.firstAttemptAt + WINDOW_MS,
  };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    rateLimitStore.set(identifier, {
      attempts: 1,
      firstAttemptAt: now,
    });
  } else {
    entry.attempts += 1;
    rateLimitStore.set(identifier, entry);
  }
}

/**
 * Reset rate limit for identifier (after successful login)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [identifier, entry] of rateLimitStore.entries()) {
    // Remove if window expired and not blocked
    if (now - entry.firstAttemptAt > WINDOW_MS && (!entry.blockedUntil || now > entry.blockedUntil)) {
      rateLimitStore.delete(identifier);
    }
  }
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Format time remaining in Hebrew
 */
export function formatTimeRemaining(ms: number): string {
  const minutes = Math.ceil(ms / 1000 / 60);
  if (minutes === 1) {
    return 'דקה אחת';
  } else if (minutes === 2) {
    return 'שתי דקות';
  } else if (minutes <= 10) {
    return `${minutes} דקות`;
  } else {
    return `${minutes} דקות`;
  }
}
