import React from 'react';
import type { ReactNode } from 'react';
import { render, screen, within } from '@testing-library/react';
import ReduxProvider from '@/app/ReduxProvider';

// Mock child providers to observe props and structure without real store/auth logic
jest.mock('@/app/StoreProvider', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ children }: { children: ReactNode }) => (
      <div data-testid="store-provider">{children}</div>
    ),
  };
});

jest.mock('@/app/AuthProvider', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ accessToken, children }: { accessToken: string | null; children: React.ReactNode }) => (
      <div data-testid="auth-provider" data-token={accessToken ?? ''}>
        {children}
      </div>
    ),
  };
});

// Mock auth0 library to control getAccessToken behavior
jest.mock('@/lib/auth0', () => ({
  __esModule: true,
  auth0: {
    getAccessToken: jest.fn(),
  },
}));

import { auth0 } from '@/lib/auth0';

describe('ReduxProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('wraps children with StoreProvider and AuthProvider and passes token (happy path)', async () => {
    (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 'abc123' });

    const ui = await ReduxProvider({ children: <div data-testid="child">content</div> });
    render(ui);

    const store = screen.getByTestId('store-provider');
    expect(store).toBeInTheDocument();

    // Verify nesting order: AuthProvider inside StoreProvider
    const auth = within(store).getByTestId('auth-provider');
    expect(auth).toBeInTheDocument();
    expect(auth).toHaveAttribute('data-token', 'abc123');

    expect(screen.getByTestId('child')).toHaveTextContent('content');
    expect(auth0.getAccessToken).toHaveBeenCalledTimes(1);
  });

  it.each([
    { name: 'undefined', value: undefined as any },
    { name: 'null', value: null as any },
    { name: 'empty object', value: {} as any },
    { name: 'object with empty token', value: { token: '' } as any },
  ])('passes null to AuthProvider when access token is $name', async ({ value }) => {
    (auth0.getAccessToken as jest.Mock).mockResolvedValue(value);

    const ui = await ReduxProvider({ children: <div data-testid="child">no token</div> });
    render(ui);

    const auth = screen.getByTestId('auth-provider');
    // Mock exposes accessToken via data-token attribute; null maps to empty string
    expect(auth).toHaveAttribute('data-token', '');
  });

  it('treats non-empty string tokens as truthy (e.g., "0")', async () => {
    (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: '0' });

    const ui = await ReduxProvider({ children: <div /> });
    render(ui);

    expect(screen.getByTestId('auth-provider')).toHaveAttribute('data-token', '0');
  });

  it('rejects when getAccessToken throws (failure condition)', async () => {
    (auth0.getAccessToken as jest.Mock).mockRejectedValue(new Error('network error'));

    await expect(
      ReduxProvider({ children: <div data-testid="child">x</div> })
    ).rejects.toThrow(Error);

    expect(auth0.getAccessToken).toHaveBeenCalledTimes(1);
  });

  it('invokes getAccessToken on each call', async () => {
    (auth0.getAccessToken as jest.Mock)
      .mockResolvedValueOnce({ token: 'first' })
      .mockResolvedValueOnce({ token: 'second' });

    const ui1 = await ReduxProvider({ children: <div /> });
    render(ui1);
    expect(auth0.getAccessToken).toHaveBeenCalledTimes(1);

    const ui2 = await ReduxProvider({ children: <span /> });
    render(ui2);
    expect(auth0.getAccessToken).toHaveBeenCalledTimes(2);
  });

  it('supports arbitrary complex children', async () => {
    (auth0.getAccessToken as jest.Mock).mockResolvedValue({ token: 't-xyz' });

    const complexChild = (
      <section aria-label="container">
        <h1>Title</h1>
        <button>Click</button>
      </section>
    );

    const ui = await ReduxProvider({ children: complexChild });
    render(ui);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
    expect(screen.getByTestId('auth-provider')).toHaveAttribute('data-token', 't-xyz');
  });
});