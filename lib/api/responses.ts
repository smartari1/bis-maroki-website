/**
 * API Response Utilities
 *
 * Standard response formats with Hebrew messages
 * All error messages in Hebrew (RTL-first)
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiError {
  error: string;
  message: string;
  details?: any;
}

export interface ApiSuccess<T = any> {
  success: true;
  data?: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

/**
 * Success response with data
 */
export function successResponse<T>(
  data: T,
  meta?: ApiSuccess['meta'],
  status: number = 200
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
    },
    { status }
  );
}

/**
 * Error response
 */
export function errorResponse(
  error: string,
  message: string,
  status: number = 400,
  details?: any
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error,
      message,
      details,
    },
    { status }
  );
}

/**
 * Validation error response (from Zod)
 */
export function validationErrorResponse(zodError: ZodError): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: 'שגיאת אימות',
      message: 'הנתונים שנשלחו אינם תקינים',
      details: zodError.flatten().fieldErrors,
    },
    { status: 400 }
  );
}

/**
 * Not found response
 */
export function notFoundResponse(resource: string = 'הפריט'): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: 'לא נמצא',
      message: `${resource} לא נמצא`,
    },
    { status: 404 }
  );
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(message: string = 'נדרשת התחברות'): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: 'לא מורשה',
      message,
    },
    { status: 401 }
  );
}

/**
 * Forbidden response
 */
export function forbiddenResponse(message: string = 'אין לך הרשאה לבצע פעולה זו'): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: 'גישה נדחתה',
      message,
    },
    { status: 403 }
  );
}

/**
 * Server error response
 */
export function serverErrorResponse(
  message: string = 'אירעה שגיאת שרת. נסה שוב מאוחר יותר.'
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: 'שגיאת שרת',
      message,
    },
    { status: 500 }
  );
}

/**
 * Handle API error and return appropriate response
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('not found')) {
      return notFoundResponse();
    }

    if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
      return unauthorizedResponse();
    }

    if (error.message.includes('forbidden') || error.message.includes('permission')) {
      return forbiddenResponse();
    }
  }

  return serverErrorResponse();
}
