import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/cookies';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'התנתקת בהצלחה',
  });

  // Clear session cookie
  response.headers.set('Set-Cookie', clearSessionCookie());

  return response;
}
