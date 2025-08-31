/**
 * @jest-environment node
 */

// Setup Web API polyfills for middleware testing
Object.defineProperty(global, 'Request', {
  writable: true,
  value: class MockRequest {
    url: string;
    method: string;
    headers: Map<string, string>;

    constructor(url: string, init?: any) {
      this.url = url;
      this.method = init?.method || 'GET';
      this.headers = new Map();
    }
  },
});

Object.defineProperty(global, 'Response', {
  writable: true,
  value: class MockResponse {
    status: number;
    headers: Map<string, string>;

    constructor(body?: any, init?: any) {
      this.status = init?.status || 200;
      this.headers = new Map();
    }

    static redirect(url: string, status = 302) {
      return new MockResponse(null, { status });
    }
  },
});

import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
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
  });

  describe('Locale redirect functionality', () => {
    test('Redirects to add locale when pathname is missing locale', async () => {
      const res = await middleware(createRequest('/create-user-profile'));
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toMatch(
        /^http:\/\/localhost:3000\/[a-z]{2}\/create-user-profile$/,
      );
    });

    test('Redirects to add locale with Accept-Language header preference', async () => {
      const res = await middleware(
        createRequest('/create-user-profile', {
          'Accept-Language': 'zh,en;q=0.9',
        }),
      );
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toBe('http://localhost:3000/zh/create-user-profile');
    });

    test('Does not redirect when locale is already present', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue(null);
      const res = await middleware(createRequest('/en/create-user-profile'));
      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).toBe(200);
    });

    test('Handles root path redirect with locale', async () => {
      const res = await middleware(createRequest('/'));
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toMatch(/^http:\/\/localhost:3000\/[a-z]{2}\/$/);
    });
  });

  describe('Auth bypass paths', () => {
    test('Bypasses locale redirect for /api/auth paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const res = await middleware(createRequest('/api/auth/login'));
      expect(auth0.middleware).toHaveBeenCalled();
      expect(res?.headers.get('location')).toBeNull();
    });

    test('Bypasses locale redirect for /auth paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const res = await middleware(createRequest('/auth/callback'));
      expect(auth0.middleware).toHaveBeenCalled();
      expect(res?.headers.get('location')).toBeNull();
    });

    test('Bypasses locale redirect for /api/ paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const res = await middleware(createRequest('/api/users'));
      expect(auth0.middleware).toHaveBeenCalled();
      expect(res?.headers.get('location')).toBeNull();
    });

    test('Bypasses locale redirect for /_next/ paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const res = await middleware(createRequest('/_next/static/css/app.css'));
      expect(auth0.middleware).toHaveBeenCalled();
      expect(res?.headers.get('location')).toBeNull();
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
        headers: {
          Authorization: 'Bearer fake-token',
        },
        cache: 'no-store',
      });
    });

    test('Redirects with correct locale when profile does not exist', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 'fake-token' });
      global.fetch = jest.fn().mockResolvedValue({ status: 404, ok: false });

      const res = await middleware(createRequest('/zh/dashboard'));
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toBe('http://localhost:3000/zh/create-user-profile');
    });

    test('Allows access to create-user-profile page when authenticated', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });

      const res = await middleware(createRequest('/en/create-user-profile'));
      expect(res?.status).not.toBe(307);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('Continues normally when profile exists (200 response)', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 'fake-token' });
      global.fetch = jest.fn().mockResolvedValue({ status: 200, ok: true });

      const res = await middleware(createRequest('/en/dashboard'));
      expect(res?.status).not.toBe(307);
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    test('Lets unauthenticated users pass through', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue(null);
      const res = await middleware(createRequest('/en/dashboard'));
      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).not.toBe(307);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('Handles missing access token gracefully', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue(null);

      const res = await middleware(createRequest('/en/dashboard'));

      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).not.toBe(307);
    });

    test('Handles fetch errors gracefully', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 'fake-token' });
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const res = await middleware(createRequest('/en/dashboard'));

      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).not.toBe(307);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[middleware] Profile check error: ',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });

    test('Handles missing backend URL gracefully', async () => {
      delete process.env.NEXT_PUBLIC_BACKEND_URL;
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 'fake-token' });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const res = await middleware(createRequest('/en/dashboard'));

      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).not.toBe(307);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[middleware] Profile check error: ',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
