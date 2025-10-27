import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/middleware';

export const runtime = 'nodejs'; // Use Node.js runtime for crypto support

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);

  if (!session) {
    return NextResponse.json(
      {
        authenticated: false,
        error: 'לא מחובר',
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    session: {
      expiresAt: session.expiresAt,
    },
  });
}
