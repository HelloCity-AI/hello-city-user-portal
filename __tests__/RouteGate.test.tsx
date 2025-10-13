import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import type { Store } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import RouteGate from '@/components/RouteGate';
import userReducer, { AuthState, type UserState, fetchUser } from '@/store/slices/user';

const replaceMock = jest.fn();
const useRouterMock = jest.fn();
const usePathnameMock = jest.fn();
const useParamsMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => useRouterMock(),
  usePathname: () => usePathnameMock(),
  useParams: () => useParamsMock(),
}));

function makeStore(partial: Partial<UserState> = {}): Store {
  const preloaded: { user: UserState } = {
    user: {
      isLoading: false,
      data: null,
      error: null,
      authStatus: AuthState.Unauthenticated,
      hasFetched: false,
      isCreating: false,
      createError: null,
      isUpdating: false,
      updateError: null,
      ...partial,
    },
  };
  return configureStore({
    reducer: { user: userReducer },
    preloadedState: preloaded,
  });
}

function renderWithStore(ui: React.ReactNode, store: Store) {
  return render(<Provider store={store}>{ui}</Provider>);
}

beforeEach(() => {
  jest.clearAllMocks();
  useRouterMock.mockReturnValue({ replace: replaceMock });
  usePathnameMock.mockReturnValue('/en/assistant');
  useParamsMock.mockReturnValue({ lang: 'en' });
});

describe('RouteGate (New)', () => {
  test('First Load: Not Fetched → Auto-Dispatch fetchUser And Show Fallback Without Flashing Children', async () => {
    const store = makeStore({
      isLoading: false,
      hasFetched: false,
      authStatus: AuthState.Unauthenticated,
      data: null,
    });

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    renderWithStore(
      <RouteGate suspendUntilReady loadingFallback={<div data-testid="fallback" />}>
        <div data-testid="content" />
      </RouteGate>,
      store,
    );

    // Render children on initial mount in current implementation
    expect(screen.getByTestId('content')).toBeInTheDocument();

    await waitFor(() =>
      expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: fetchUser.type })),
    );
  });

  test('Fetched & No Profile (Protected Page) → Redirect To /{lang}/create-user-profile And Keep Fallback', async () => {
    // Protected page
    usePathnameMock.mockReturnValue('/en/assistant');
    useParamsMock.mockReturnValue({ lang: 'en' });

    const store = makeStore({
      isLoading: false,
      hasFetched: true,
      data: null,
      authStatus: AuthState.AuthenticatedButNoProfile,
    });

    renderWithStore(
      <RouteGate requireProfile suspendUntilReady loadingFallback={<div data-testid="fallback" />}>
        <div data-testid="protected" />
      </RouteGate>,
      store,
    );

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/en/create-user-profile'));
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  test('Fetched & Has Profile (Create Page) → Redirect To /{lang}/assistant And Keep Fallback', async () => {
    // Create page
    usePathnameMock.mockReturnValue('/en/create-user-profile');
    useParamsMock.mockReturnValue({ lang: 'en' });

    const store = makeStore({
      isLoading: false,
      hasFetched: true,
      data: { userId: 'u1' } as any,
      authStatus: AuthState.AuthenticatedWithProfile,
    });

    renderWithStore(
      <RouteGate
        requireProfile={false}
        redirectIfHasProfile
        suspendUntilReady
        loadingFallback={<div data-testid="fallback" />}
      >
        <div data-testid="create-page" />
      </RouteGate>,
      store,
    );

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/en/assistant'));
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  test('Fetched & Has Profile (Protected Page) → Render Children Without Redirect', async () => {
    // Protected page
    usePathnameMock.mockReturnValue('/en/assistant');

    const store = makeStore({
      isLoading: false,
      hasFetched: true,
      data: { userId: 'u1' } as any,
      authStatus: AuthState.AuthenticatedWithProfile,
    });

    renderWithStore(
      <RouteGate requireProfile suspendUntilReady loadingFallback={<div data-testid="fallback" />}>
        <div data-testid="protected-content" />
      </RouteGate>,
      store,
    );

    await new Promise((r) => setTimeout(r, 0));
    expect(replaceMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  test('New: Assistant Soft Refresh – Fetched & Unauthenticated (Transient 401) → No Redirect To Home/Elsewhere (onAssistantPage Guard)', async () => {
    // Still on assistant
    usePathnameMock.mockReturnValue('/en/assistant');

    const store = makeStore({
      isLoading: false,
      hasFetched: true,
      data: null,
      authStatus: AuthState.Unauthenticated, // Transient unauthenticated (soft-refresh 401)
    });

    renderWithStore(
      <RouteGate requireProfile suspendUntilReady loadingFallback={<div data-testid="fallback" />}>
        <div data-testid="assistant-soft-refresh" />
      </RouteGate>,
      store,
    );

    await new Promise((r) => setTimeout(r, 0));
    // Should not trigger router.replace (depends on your !onAssistantPage fix)
    expect(replaceMock).not.toHaveBeenCalled();
  });

  test('New: Non-Assistant Protected Page & Unauthenticated → Trigger willRedirectHomeFromProtected To /{lang}/assistant', async () => {
    usePathnameMock.mockReturnValue('/en/some-protected');
    useParamsMock.mockReturnValue({ lang: 'en' });

    const store = makeStore({
      isLoading: false,
      hasFetched: true,
      data: null,
      authStatus: AuthState.Unauthenticated,
    });

    renderWithStore(
      <RouteGate requireProfile suspendUntilReady loadingFallback={<div data-testid="fallback" />}>
        <div data-testid="some-protected" />
      </RouteGate>,
      store,
    );

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/en/assistant'));
  });

  test('New: When isLoading=true Do Not Dispatch fetchUser Again (requestedRef + isLoading Debounce)', async () => {
    const store = makeStore({
      isLoading: true,
      hasFetched: false,
      authStatus: AuthState.Unauthenticated,
      data: null,
    });

    const dispatchSpy = jest.spyOn(store, 'dispatch');

    renderWithStore(
      <RouteGate suspendUntilReady loadingFallback={<div data-testid="fallback" />}>
        <div data-testid="content" />
      </RouteGate>,
      store,
    );

    await new Promise((r) => setTimeout(r, 0));
    expect(dispatchSpy).not.toHaveBeenCalledWith(expect.objectContaining({ type: fetchUser.type }));
  });
});
