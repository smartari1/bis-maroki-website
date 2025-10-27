/**
 * Admin Session Verification API Route
 *
 * GET /api/admin/verify
 * Checks if current session is valid
 * All responses in Hebrew (RTL-first)
 */

import { NextResponse } from 'next/server';
import { getSession, isSessionExpiringSoon } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const sessionData = getSession(request);

    if (!sessionData) {
      return NextResponse.json(
        {
          authenticated: false,
          message: 'אין הפעלה פעילה',
        },
        { status: 401 }
      );
    }

    const expiringSoon = isSessionExpiringSoon(sessionData);

    return NextResponse.json(
      {
        authenticated: true,
        message: 'הפעלה פעילה',
        expiresAt: sessionData.expiresAt,
        expiringSoon,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      {
        error: 'שגיאת שרת',
        message: 'אירעה שגיאה בעת בדיקת ההפעלה',
      },
      { status: 500 }
    );
  }
}
