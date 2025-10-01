import { AccessTokenError } from '@auth0/nextjs-auth0/errors';
import axios, { type AxiosError } from 'axios';
import { NextResponse } from 'next/server';

/**
 * Handle Axios errors with proper typing and error responses
 */
export function handleAxiosError(axiosError: AxiosError, operation: string): NextResponse {
  console.error(
    `Backend API error during ${operation}:`,
    axiosError.response?.data || axiosError.message,
  );

  if (axiosError.response?.status === 401) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(
    {
      error: `Failed to ${operation}`,
      details: axiosError.response?.data || axiosError.message,
    },
    { status: axiosError.response?.status || 500 },
  );
}

/**
 * Handle general API errors including Auth0 and Axios errors
 */
export function handleApiError(error: unknown, operation: string): NextResponse {
  if (error instanceof AccessTokenError) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        code: error.code,
        details: error.message,
      },
      {
        status: 401,
        headers: {
          'WWW-Authenticate':
            'Bearer realm="api", error="invalid_token", error_description="Missing Session"',
        },
      },
    );
  }

  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          code: 'BACKEND_UNAUTHORIZED',
          details: error.message,
        },
        {
          status: error.response.status,
          headers: {
            'WWW-Authenticate':
              'Bearer realm="api", error="invalid_token", error_description="Token expired or invalid"',
          },
        },
      );
    }

    if (error.response) {
      return NextResponse.json(
        {
          error: `Error occurred while ${operation}`,
          details: error.message,
        },
        { status: error.response.status },
      );
    }
  }

  return NextResponse.json(
    {
      error: `Error occurred while ${operation}`,
      details: error instanceof Error ? error.message : String(error),
    },
    { status: 500 },
  );
}
