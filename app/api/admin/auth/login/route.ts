import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSessionToken } from '@/lib/auth/session';
import { setSessionCookie } from '@/lib/auth/cookies';

export const runtime = 'nodejs'; // Use Node.js runtime for crypto support

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'נדרשת סיסמה' },
        },
        { status: 400 }
      );
    }

    // Verify password
    const isValid = verifyPassword(password);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'סיסמה שגויה' },
        },
        { status: 401 }
      );
    }

    // Create session token
    const token = createSessionToken();

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      message: 'התחברת בהצלחה',
    });

    // Set cookie
    response.headers.set('Set-Cookie', setSessionCookie(token));

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { message: 'שגיאה בהתחברות' },
      },
      { status: 500 }
    );
  }
}
