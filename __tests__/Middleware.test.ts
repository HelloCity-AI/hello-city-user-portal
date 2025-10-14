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

    constructor(url: string, init?: { method?: string }) {
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

    constructor(body?: unknown, init?: { status?: number }) {
      this.status = init?.status || 200;
      this.headers = new Map();
    }

    static redirect(url: string, status = 302) {
      return new MockResponse(null, { status });
    }
  },
});

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
  });

  describe('Locale redirect functionality', () => {
    it('Redirects to add locale when pathname is missing locale', async () => {
      const res = await middleware(createRequest('/create-user-profile'));
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toMatch(
        /^http:\/\/localhost:3000\/[a-z]{2}\/create-user-profile$/,
      );
    });

    it('Redirects to add locale with Accept-Language header preference', async () => {
      const res = await middleware(
        createRequest('/create-user-profile', {
          'Accept-Language': 'zh-CN,en;q=0.9',
        }),
      );
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toBe('http://localhost:3000/zh_CN/create-user-profile');
    });

    it('Does not redirect when locale is already present (home page)', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue(null);
      const res = await middleware(createRequest('/en/'));
      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).toBe(200);
    });

    it('Handles root path redirect with locale', async () => {
      const res = await middleware(createRequest('/'));
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toMatch(/^http:\/\/localhost:3000\/[a-z]{2}\/$/);
    });
  });

  describe('Auth bypass paths', () => {
    it('Bypasses locale redirect for /api/auth paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const res = await middleware(createRequest('/api/auth/login'));
      expect(auth0.middleware).toHaveBeenCalled();
      expect(res?.headers.get('location')).toBeNull();
    });

    it('Bypasses locale redirect for /auth paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const res = await middleware(createRequest('/auth/callback'));
      expect(auth0.middleware).toHaveBeenCalled();
      expect(res?.headers.get('location')).toBeNull();
    });

    it('Bypasses locale redirect for /api/ paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const res = await middleware(createRequest('/api/users'));
      expect(auth0.middleware).toHaveBeenCalled();
      expect(res?.headers.get('location')).toBeNull();
    });

    it('Bypasses locale redirect for /_next/ paths', async () => {
      (auth0.middleware as jest.Mock).mockResolvedValue(NextResponse.next());
      const res = await middleware(createRequest('/_next/static/css/app.css'));
      expect(auth0.middleware).toHaveBeenCalled();
      expect(res?.headers.get('location')).toBeNull();
    });
  });

  // COMMENTED OUT: Profile redirect functionality tests
  // These tests are for the profile check feature that is currently commented out in middleware.ts
  /*
  describe('Profile redirect functionality', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8000';
    });

    it('Redirects to create-user-profile if /api/user/me returns 404', async () => {
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

    it('Redirects with correct locale when profile does not exist', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 'fake-token' });
      global.fetch = jest.fn().mockResolvedValue({ status: 404, ok: false });

      const res = await middleware(createRequest('/zh-CN/dashboard'));
      expect(res?.status).toBe(307);
      expect(res?.headers.get('location')).toBe('http://localhost:3000/zh-CN/create-user-profile');
    });

    it('Allows access to create-user-profile page when authenticated', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });

      const res = await middleware(createRequest('/en/create-user-profile'));
      expect(res?.status).not.toBe(307);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('Continues normally when profile exists (200 response)', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 'fake-token' });
      global.fetch = jest.fn().mockResolvedValue({ status: 200, ok: true });

      const res = await middleware(createRequest('/en/dashboard'));
      expect(res?.status).not.toBe(307);
      expect(global.fetch).toHaveBeenCalled();
    });
  });
  */

  describe('Protected page authentication', () => {
    describe('Chat page protection', () => {
      it('Blocks unauthenticated users from /en/assistant', async () => {
        (auth0.getSession as jest.Mock).mockResolvedValue(null);

        const res = await middleware(createRequest('/en/assistant'));

        expect(res?.status).toBe(307);
        expect(res?.headers.get('location')).toBe('http://localhost:3000/en/');
      });

      it('Blocks unauthenticated users from /zh_CN/assistant', async () => {
        (auth0.getSession as jest.Mock).mockResolvedValue(null);

        const res = await middleware(createRequest('/zh_CN/assistant'));

        expect(res?.status).toBe(307);
        expect(res?.headers.get('location')).toBe('http://localhost:3000/zh_CN/');
      });

      it('Allows authenticated users to access /en/assistant', async () => {
        (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });

        const res = await middleware(createRequest('/en/assistant'));

        expect(res?.status).toBe(200);
        expect(res?.headers.get('location')).toBeNull();
      });

      it('Allows authenticated users to access /zh_CN/assistant', async () => {
        (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });

        const res = await middleware(createRequest('/zh_CN/assistant'));

        expect(res?.status).toBe(200);
        expect(res?.headers.get('location')).toBeNull();
      });
    });

    describe('Create user profile page protection', () => {
      it('Blocks unauthenticated users from /en/create-user-profile', async () => {
        (auth0.getSession as jest.Mock).mockResolvedValue(null);

        const res = await middleware(createRequest('/en/create-user-profile'));

        expect(res?.status).toBe(307);
        expect(res?.headers.get('location')).toBe('http://localhost:3000/en/');
      });

      it('Blocks unauthenticated users from /zh_CN/create-user-profile', async () => {
        (auth0.getSession as jest.Mock).mockResolvedValue(null);

        const res = await middleware(createRequest('/zh_CN/create-user-profile'));

        expect(res?.status).toBe(307);
        expect(res?.headers.get('location')).toBe('http://localhost:3000/zh_CN/');
      });

      it('Allows authenticated users to access /en/create-user-profile', async () => {
        (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });

        const res = await middleware(createRequest('/en/create-user-profile'));

        expect(res?.status).toBe(200);
        expect(res?.headers.get('location')).toBeNull();
      });

      it('Allows authenticated users to access /zh_CN/create-user-profile', async () => {
        (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });

        const res = await middleware(createRequest('/zh_CN/create-user-profile'));

        expect(res?.status).toBe(200);
        expect(res?.headers.get('location')).toBeNull();
      });
    });

    describe('Non-protected pages', () => {
      it('Allows unauthenticated users to access home page', async () => {
        (auth0.getSession as jest.Mock).mockResolvedValue(null);

        const res = await middleware(createRequest('/en/'));

        expect(res?.status).toBe(200);
        expect(res?.headers.get('location')).toBeNull();
      });
    });
  });

  // COMMENTED OUT: Error handling tests for profile check functionality
  // These tests are for the profile check feature that is currently commented out in middleware.ts
  /*
  describe('Error handling', () => {
    it('Lets unauthenticated users pass through', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue(null);
      const res = await middleware(createRequest('/en/dashboard'));
      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).not.toBe(307);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('Handles missing access token gracefully', async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: { sub: 'abc' } });
      (auth0.getAccessToken as jest.Mock).mockResolvedValue(null);

      const res = await middleware(createRequest('/en/dashboard'));

      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).not.toBe(307);
    });

    it('Handles fetch errors gracefully', async () => {
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

    it('Handles missing backend URL gracefully', async () => {
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
  */
});
