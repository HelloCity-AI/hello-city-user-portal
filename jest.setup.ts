import '@testing-library/jest-dom';
import type { ImageProps } from 'next/image';
import React from 'react';

// Web Request polyfill for Jest (favor undici if available, else minimal shim)
try {
  const {
    Request: UndiciRequest,
    Headers: UndiciHeaders,
    Response: UndiciResponse,
    fetch: undiciFetch,
    // eslint-disable-next-line @typescript-eslint/no-require-imports
  } = require('undici');
  if (!globalThis.Request) globalThis.Request = UndiciRequest as never;
  if (!globalThis.Headers) globalThis.Headers = UndiciHeaders as never;
  if (!globalThis.Response) globalThis.Response = UndiciResponse as never;
  if (!globalThis.fetch) globalThis.fetch = undiciFetch as never;
} catch {
  // undici not available; fall back to a minimal standards-like Request
}
if (!globalThis.Headers) {
  class MinimalHeaders {
    private _headers: Record<string, string> = {};

    constructor(init?: HeadersInit) {
      if (!init) return;
      if (Array.isArray(init)) {
        for (const [key, value] of init) {
          this._headers[String(key).toLowerCase()] = String(value);
        }
      } else if (
        typeof init === 'object' &&
        'entries' in init &&
        typeof (init as any).entries === 'function'
      ) {
        for (const [key, value] of Array.from(
          (init as any).entries() as Iterable<[string, string]>,
        )) {
          this._headers[String(key).toLowerCase()] = String(value);
        }
      } else if (typeof init === 'object') {
        for (const [key, value] of Object.entries(init as Record<string, string>)) {
          this._headers[String(key).toLowerCase()] = String(value);
        }
      }
    }

    get(name: string): string | null {
      return this._headers[name.toLowerCase()] || null;
    }

    set(name: string, value: string): void {
      this._headers[name.toLowerCase()] = String(value);
    }

    has(name: string): boolean {
      return Object.prototype.hasOwnProperty.call(this._headers, name.toLowerCase());
    }

    delete(name: string): void {
      delete this._headers[name.toLowerCase()];
    }
    *entries(): IterableIterator<[string, string]> {
      for (const [key, value] of Object.entries(this._headers)) {
        yield [key, value];
      }
    }
    forEach(cb: (value: string, key: string) => void): void {
      for (const [key, value] of Object.entries(this._headers)) cb(value, key);
    }
    [Symbol.iterator](): IterableIterator<[string, string]> {
      return this.entries();
    }
  }
  globalThis.Headers = MinimalHeaders as never;
}

if (!globalThis.Request) {
  class MinimalRequest {
    url: string;
    method: string;
    headers: Headers;
    body?: BodyInit | null;
    constructor(input: string | Request, init: RequestInit = {}) {
      const fromReq = typeof input === 'string' ? undefined : (input as Request);
      this.url = typeof input === 'string' ? input : fromReq!.url;
      // Merge semantics: init overrides input, fall back to GET
      this.method = init.method ?? (fromReq as Request)?.method ?? 'GET';
      this.headers = new Headers(init.headers ?? (fromReq as Request)?.headers ?? {});
      this.body = init.body ?? (fromReq as Request)?.body;
    }
    clone() {
      return new (globalThis as typeof globalThis & { Request: typeof Request }).Request(this.url, {
        method: this.method,
        headers: new globalThis.Headers(this.headers),
        body: this.body,
      });
    }
  }
  globalThis.Request = MinimalRequest as never;
}

if (!global.Response) {
  global.Response = class Response {
    status: number;
    statusText: string;
    headers: Headers;
    body?: unknown;

    constructor(body?: unknown, init?: ResponseInit) {
      this.status = init?.status || 200;
      this.statusText = init?.statusText || 'OK';
      this.headers = new Headers(init?.headers ?? {});
      this.body = body;
      if (body && typeof body === 'object' && !this.headers.get('content-type')) {
        this.headers.set('content-type', 'application/json');
      }
    }

    get ok() {
      return this.status >= 200 && this.status < 300;
    }
    async text(): Promise<string> {
      if (typeof this.body === 'string') return this.body;
      if (this.body == null) return '';
      return String(this.body);
    }
    async json(): Promise<any> {
      if (typeof this.body === 'string') return JSON.parse(this.body);
      return this.body;
    }
  } as never;
}

// Minimal FormData polyfill for tests
if (typeof (globalThis as any).FormData === 'undefined') {
  class MinimalFormData {
    private _data: Array<[string, any]> = [];
    append(name: string, value: any): void {
      this._data.push([String(name), value]);
    }
    // Optional helpers for debugging/matchers if needed later
    entries(): IterableIterator<[string, any]> {
      return this._data[Symbol.iterator]() as IterableIterator<[string, any]>;
    }
  }
  (globalThis as any).FormData = MinimalFormData;
}

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.HTMLElement.prototype.scrollIntoView = function () {};
}

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.ResizeObserver = ResizeObserver;
}
// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockLink = React.forwardRef(({ children, href, ...props }: any, ref: any) => {
    return React.createElement('a', { href, ref, ...props }, children);
  });
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock LanguageContext with React state
jest.mock('./src/contexts/LanguageContext', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockLanguageProvider = ({ children }: any) => {
    const [language, setLanguage] = React.useState('en');

    const contextValue = {
      language,
      setLanguage,
      isLanguage: (lang: string) => language === lang,
      availableLanguages: ['en', 'zh'],
    };

    return React.createElement(
      React.createContext(contextValue).Provider,
      { value: contextValue },
      children,
    );
  };

  return {
    useLanguage: () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const React = require('react');
      const [language, setLanguage] = React.useState('en');
      return {
        language,
        setLanguage,
        isLanguage: (lang: string) => language === lang,
        availableLanguages: ['en', 'zh'],
      };
    },
    LanguageProvider: MockLanguageProvider,
  };
});

// Mock @lingui/react
jest.mock('@lingui/react', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Trans: ({ children, message }: any) => React.createElement('span', {}, message || children),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    I18nProvider: ({ children }: any) => children,
    useLingui: () => ({
      i18n: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        _: (id: string, _values?: any) => id,
        locale: 'en',
      },
    }),
  };
});

// Mock @lingui/core and src/i18n (they export the same i18n instance)
jest.mock('@lingui/core', () => ({
  i18n: {
    locale: 'en',
    activate: jest.fn(),
    load: jest.fn(),
    _: (id: string) => id,
  },
}));

jest.mock('./src/i18n', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { i18n } = require('@lingui/core');
  return { i18n };
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) =>
    React.createElement('img', {
      ...props,
      src: typeof props.src === 'string' ? props.src : '',
      alt: props.alt ?? '',
    }),
}));

// MUI theme useTheme mock with custom tokens for tests
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: () => ({
    backgroundGradients: {
      buttonPrimaryActive: 'mock-gradient',
    },
  }),
}));
