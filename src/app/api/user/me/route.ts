import { auth0 } from '@/lib/auth0';
import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';

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
    if (!token) {
      return NextResponse.json({ error: 'No access token available' }, { status: 401 });
    }

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
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          error: 'Error occurred while getting ME profile',
          details: error.message,
        },
        { status: error.response.status },
      );
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
