import { auth0 } from '@/lib/auth0';
import { AccessTokenError } from '@auth0/nextjs-auth0/errors';
import axios from 'axios';
import { type NextRequest, NextResponse } from 'next/server';

export async function fetchUserProfile(token: string, backendUrl: string) {
  const userResponse = await axios.get(`${backendUrl}/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-store',
      Accept: 'application/json',
    },
    timeout: 10000,
    validateStatus: (status) => status === 200 || status === 404,
  });
  return userResponse;
}

export async function GET(_request: NextRequest) {
  try {
    const tokenResponse = await auth0.getAccessToken();
    const token = tokenResponse?.token;

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { error: 'Backend URL is not configured (NEXT_PUBLIC_BACKEND_URL)' },
        { status: 500 },
      );
    }

    const userResponse = await fetchUserProfile(token, apiUrl);
    return NextResponse.json(userResponse.data, { status: userResponse.status });
  } catch (error) {
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
            error: 'Error occurred while getting ME profile',
            details: error.message,
          },
          { status: error.response.status },
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Error occurred while getting ME profile',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
