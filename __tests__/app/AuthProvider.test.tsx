/**
 * Test framework and libraries:
 * - Jest as the test runner
 * - @testing-library/react for rendering and queries
 * - @testing-library/jest-dom for extended DOM matchers
 *
 * These tests validate the behavior introduced in AuthProvider:
 * - It always renders children
 * - It dispatches fetchUser when a non-null accessToken is provided
 * - It does not dispatch when accessToken is null/undefined
 * - It re-dispatches when the token changes
 */

import React from 'react';
import { render, screen, cleanup, act } from '@testing-library/react';

// Mock react-redux useDispatch to track dispatch calls
const mockDispatch = jest.fn();
jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

// Mock fetchUser action creator
const fetchUserReturnSentinel = { type: 'user/fetchUser/mock' } as any;
const mockFetchUser = jest.fn().mockReturnValue(fetchUserReturnSentinel);
jest.mock('@/store/slices/user', () => ({
  fetchUser: (...args: any[]) => mockFetchUser(...args),
}));

// Import after mocks so component uses mocked modules
// Note: Path mirrors the component under test per provided snippet.
import AuthProvider from '../../app/AuthProvider'; // Adjust if component resides elsewhere

describe('AuthProvider', () => {
  const Child = () => <div data-testid="child">Hello</div>;

  beforeEach(() => {
    mockDispatch.mockClear();
    mockFetchUser.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders children when accessToken is null', () => {
    render(
      <AuthProvider accessToken={null}>
        <Child />
      </AuthProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(mockFetchUser).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('renders children when accessToken is provided', () => {
    render(
      <AuthProvider accessToken="token-123">
        <Child />
      </AuthProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('dispatches fetchUser with the provided accessToken on mount', () => {
    render(
      <AuthProvider accessToken="token-abc">
        <Child />
      </AuthProvider>
    );

    expect(mockFetchUser).toHaveBeenCalledTimes(1);
    expect(mockFetchUser).toHaveBeenCalledWith('token-abc');
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(fetchUserReturnSentinel);
  });

  it('does not dispatch when accessToken is undefined', () => {
    // @ts-expect-error intentionally omitting prop to simulate undefined
    render(
      <AuthProvider>
        <Child />
      </AuthProvider>
    );

    expect(mockFetchUser).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('re-dispatches when accessToken changes', () => {
    const { rerender } = render(
      <AuthProvider accessToken="token-1">
        <Child />
      </AuthProvider>
    );

    expect(mockFetchUser).toHaveBeenCalledTimes(1);
    expect(mockFetchUser).toHaveBeenLastCalledWith('token-1');

    act(() => {
      rerender(
        <AuthProvider accessToken="token-2">
          <Child />
        </AuthProvider>
      );
    });

    expect(mockFetchUser).toHaveBeenCalledTimes(2);
    expect(mockFetchUser).toHaveBeenLastCalledWith('token-2');
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('does not re-dispatch when accessToken remains the same on rerender', () => {
    const { rerender } = render(
      <AuthProvider accessToken="same-token">
        <Child />
      </AuthProvider>
    );

    expect(mockFetchUser).toHaveBeenCalledTimes(1);
    expect(mockFetchUser).toHaveBeenLastCalledWith('same-token');

    act(() => {
      rerender(
        <AuthProvider accessToken="same-token">
          <Child />
        </AuthProvider>
      );
    });

    // React won't trigger effect if dependencies did not change
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('guards early and does not dispatch if accessToken becomes null', () => {
    const { rerender } = render(
      <AuthProvider accessToken="initial-token">
        <Child />
      </AuthProvider>
    );

    expect(mockFetchUser).toHaveBeenCalledTimes(1);

    act(() => {
      rerender(
        <AuthProvider accessToken={null}>
          <Child />
        </AuthProvider>
      );
    });

    // No additional calls after setting token to null
    expect(mockFetchUser).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});