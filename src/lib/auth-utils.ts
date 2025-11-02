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
 * Custom error class for authentication failures
 * Wraps NextResponse errors for unified error handling
 */
export class AuthError extends Error {
  constructor(public response: NextResponse) {
    super('Authentication error');
    this.name = 'AuthError';
  }
}

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
  return process.env.BACKEND_URL || null;
}

/**
 * Validate backend URL and return error response if invalid
 */
export function validateBackendUrl(): NextResponse | null {
  const apiUrl = getBackendUrl();
  if (!apiUrl) {
    return NextResponse.json(
      { error: 'Backend URL is not configured (BACKEND_URL)' },
      { status: 500 },
    );
  }
  return null;
}

/**
 * Get authentication context (token and backend URL) with validation
 * Throws AuthError if validation fails
 *
 * @returns Object containing token and apiUrl
 * @throws {AuthError} When backend URL is not configured or token retrieval fails
 *
 * @example
 * try {
 *   const { token, apiUrl } = await getAuthContext();
 *   const response = await getConversations(token, apiUrl);
 *   return NextResponse.json(response.data, { status: response.status });
 * } catch (error) {
 *   if (error instanceof AuthError) {
 *     return error.response;
 *   }
 *   return handleApiError(error, 'getting conversations');
 * }
 */
export async function getAuthContext(): Promise<{ token: string; apiUrl: string }> {
  // Validate backend URL
  const backendUrlError = validateBackendUrl();
  if (backendUrlError) {
    throw new AuthError(backendUrlError);
  }

  // Get access token
  const tokenResult = await getAccessTokenWithValidation();
  if (tokenResult.error) {
    throw new AuthError(tokenResult.error);
  }

  return {
    token: tokenResult.token,
    apiUrl: getBackendUrl()!,
  };
}
