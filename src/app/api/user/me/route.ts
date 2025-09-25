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

/**
 * Get current user profile
 */
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
    return handleApiError(error, 'getting ME profile');
  }
}

/**
 * Create a new user profile
 */
export async function POST(request: NextRequest) {
  try {
    const tokenResponse = await auth0.getAccessToken();
    const token = tokenResponse?.token;

    if (!token) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    // Get the form data from the request
    const formData = await request.formData();

    try {
      const response = await axios.post(`${apiUrl}/api/user`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: '*/*',
        },
        timeout: 10000,
      });

      return NextResponse.json(response.data, { status: response.status });
    } catch (axiosError: any) {
      return handleAxiosError(axiosError, 'create user');
    }
  } catch (error) {
    return handleApiError(error, 'creating user');
  }
}

/**
 * Update current user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const tokenResponse = await auth0.getAccessToken();
    const token = tokenResponse?.token;

    if (!token) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    // Get the JSON data from the request
    const userData = await request.json();

    try {
      const response = await axios.put(`${apiUrl}/api/user/me`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      return NextResponse.json(response.data, { status: response.status });
    } catch (axiosError: any) {
      return handleAxiosError(axiosError, 'update user');
    }
  } catch (error) {
    return handleApiError(error, 'updating user');
  }
}

/**
 * Delete current user profile
 */
export async function DELETE(_request: NextRequest) {
  try {
    const tokenResponse = await auth0.getAccessToken();
    const token = tokenResponse?.token;

    if (!token) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 401 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: 'Backend URL not configured' }, { status: 500 });
    }

    try {
      const response = await axios.delete(`${apiUrl}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });

      return NextResponse.json(response.data, { status: response.status });
    } catch (axiosError: any) {
      return handleAxiosError(axiosError, 'delete user');
    }
  } catch (error) {
    return handleApiError(error, 'deleting user');
  }
}

/**
 * Handle Axios errors
 */
function handleAxiosError(axiosError: any, operation: string) {
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
 * Handle general API errors
 */
function handleApiError(error: any, operation: string) {
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
