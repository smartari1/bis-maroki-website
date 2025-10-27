/**
 * Admin Logout API Route
 *
 * POST /api/admin/logout
 * Clears session cookie
 * All responses in Hebrew (RTL-first)
 */

import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookie = clearSessionCookie();

    return NextResponse.json(
      {
        success: true,
        message: 'התנתקת בהצלחה',
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
        },
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        error: 'שגיאת שרת',
        message: 'אירעה שגיאה בעת ההתנתקות',
      },
      { status: 500 }
    );
  }
}
