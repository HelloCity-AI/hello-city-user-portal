/**
 * @jest-environment jsdom
 */
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '../src/middleware';
import { auth0 } from '../src/lib/auth0';

// mock auth0
jest.mock('../src/lib/auth0', () => ({
  auth0: {
    middleware: jest.fn().mockResolvedValue(undefined),
    getSession: jest.fn(),
    getAccessToken: jest.fn(),
  },
}));

describe('middleware', () => {
  const createRequest = (pathname: string, headers?: Record<string, string>) => {
    const request = new NextRequest(`http://localhost:3000${pathname}`);
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        request.headers.set(key, value);
      });
    }
    return request;
  };

  afterEach(() => {
    jest.clearAllMocks();
    // @ts-expect-error - Clearing fetch mock
    global.fetch = undefined;
  });

  describe('Locale redirect functionality', () => {
    test('Redirects to add locale when pathname is missing locale', async () => {
      const res = await middleware(createRequest('/dashboard'));
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toMatch(
        /^http:\/\/localhost:3000\/[a-z]{2}\/dashboard$/,
      );
    });

    test('Redirects to add locale with Accept-Language header preference', async () => {
      const res = await middleware(
        createRequest('/dashboard', {
          'Accept-Language': 'zh,en;q=0.9',
        }),
      );
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toBe('http://localhost:3000/zh/dashboard');
    });

    test('Does not redirect when locale is already present', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue(null);
      const res = await middleware(createRequest('/en/dashboard'));
      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).toBe(200);
    });
  });

  describe('Auth bypass paths', () => {
    test('Bypasses locale redirect for /api/auth paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const _res = await middleware(createRequest('/api/auth/login'));
      expect(auth0.middleware).toHaveBeenCalled();
    });

    test('Bypasses locale redirect for /auth paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const _res = await middleware(createRequest('/auth/callback'));
      expect(auth0.middleware).toHaveBeenCalled();
    });

    test('Bypasses locale redirect for /api/ paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const _res = await middleware(createRequest('/api/users'));
      expect(auth0.middleware).toHaveBeenCalled();
    });

    test('Bypasses locale redirect for /_next/ paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const _res = await middleware(createRequest('/_next/static/css/app.css'));
      expect(auth0.middleware).toHaveBeenCalled();
    });
  });

  describe('Profile redirect functionality', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8000';
    });

    test('Redirects to create-user-profile if /api/user/me returns 404', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 'fake-token' });
      global.fetch = jest.fn().mockResolvedValue({ status: 404, ok: false });

      const res = await middleware(createRequest('/en/dashboard'));
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toBe('http://localhost:3000/en/create-user-profile');
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/api/user/me', {
        headers: { Authorization: 'Bearer fake-token' },
        cache: 'no-store',
      });
    });

    test('Lets request continue if /me returns 200', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 'fake-token' });
      global.fetch = jest.fn().mockResolvedValue({ status: 200, ok: true });

      const res = await middleware(createRequest('/en/dashboard'));
      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).toBe(200);
    });

    test('Lets unauthenticated users pass through', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue(null);
      const res = await middleware(createRequest('/en/dashboard'));
      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).toBe(200);
    });
  });

  describe('Error handling', () => {
    test('Handles missing access token gracefully', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue(null);

      const res = await middleware(createRequest('/en/dashboard'));
      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).toBe(200);
    });

    test('Handles fetch errors gracefully', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 'fake-token' });
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const res = await middleware(createRequest('/en/dashboard'));
      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).toBe(200);
    });
  });
});
