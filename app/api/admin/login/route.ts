/**
 * Admin Login API Route
 *
 * POST /api/admin/login
 * Single password gate with rate limiting
 * All responses in Hebrew (RTL-first)
 */

import { NextResponse } from 'next/server';
import { adminLoginSchema } from '@/lib/validation';
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
} from '@/lib/auth';
import {
  getClientIdentifier,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  formatTimeRemaining,
} from '@/lib/auth/rate-limit';

export async function POST(request: Request) {
  try {
    // Check rate limit
    const identifier = getClientIdentifier(request);
    const rateLimit = checkRateLimit(identifier);

    if (!rateLimit.allowed) {
      const timeRemaining = rateLimit.blockedUntil
        ? formatTimeRemaining(rateLimit.blockedUntil - Date.now())
        : 'מספר דקות';

      return NextResponse.json(
        {
          error: 'חסום זמנית',
          message: `ניסיתם להתחבר יותר מדי פעמים. נסו שוב בעוד ${timeRemaining}.`,
          resetAt: rateLimit.resetAt,
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = adminLoginSchema.safeParse(body);

    if (!validation.success) {
      recordFailedAttempt(identifier);
      return NextResponse.json(
        {
          error: 'שגיאת אימות',
          message: 'סיסמה נדרשת',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { password } = validation.data;

    // Verify password
    if (!verifyPassword(password)) {
      recordFailedAttempt(identifier);

      const updatedRateLimit = checkRateLimit(identifier);
      const remainingAttempts = updatedRateLimit.remainingAttempts;

      return NextResponse.json(
        {
          error: 'סיסמה שגויה',
          message:
            remainingAttempts > 0
              ? `סיסמה שגויה. נותרו ${remainingAttempts} ניסיונות.`
              : 'סיסמה שגויה. חשבונך נחסם זמנית.',
          remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Password correct - create session
    resetRateLimit(identifier);
    const token = createSessionToken();
    const cookie = setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: 'התחברות הצליחה',
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
        },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        error: 'שגיאת שרת',
        message: 'אירעה שגיאה בעת ההתחברות. נסו שוב מאוחר יותר.',
      },
      { status: 500 }
    );
  }
}
