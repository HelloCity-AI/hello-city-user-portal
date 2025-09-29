import { auth0 } from '@/lib/auth0';
import { NextResponse } from 'next/server';

export interface AuthTokenResult {
  token: string;
  error?: never;
}

export interface AuthTokenError {
  token?: never;
  error: NextResponse;
}

export type AuthTokenResponse = AuthTokenResult | AuthTokenError;

/**
 * Get access token with proper error handling
 * Returns either the token or an error response
 */
export async function getAccessTokenWithValidation(): Promise<AuthTokenResponse> {
  try {
    const tokenResponse = await auth0.getAccessToken();
    const token = tokenResponse?.token;

    if (!token) {
      return {
        error: NextResponse.json({ error: 'Access token not found' }, { status: 401 }),
      };
    }

    return { token };
  } catch (error) {
    console.error('Failed to get access token:', error);
    return {
      error: NextResponse.json(
        {
          error: 'Failed to authenticate',
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 401 },
      ),
    };
  }
}

/**
 * Get backend URL with validation
 */
export function getBackendUrl(): string | null {
  return process.env.NEXT_PUBLIC_BACKEND_URL || null;
}

/**
 * Validate backend URL and return error response if invalid
 */
export function validateBackendUrl(): NextResponse | null {
  const apiUrl = getBackendUrl();
  if (!apiUrl) {
    return NextResponse.json(
      { error: 'Backend URL is not configured (NEXT_PUBLIC_BACKEND_URL)' },
      { status: 500 },
    );
  }
  return null;
}
