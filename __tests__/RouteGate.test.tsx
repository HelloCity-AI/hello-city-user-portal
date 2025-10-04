import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import type { Store } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import RouteGate from '@/components/RouteGate';
import userReducer, { AuthState, type UserState, fetchUser } from '@/store/slices/user';

// ---- mock next/navigation ----
const replaceMock = jest.fn();
const useRouterMock = jest.fn();
const usePathnameMock = jest.fn();
const useParamsMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => useRouterMock(),
  usePathname: () => usePathnameMock(),
  useParams: () => useParamsMock(),
}));

// ---- helpers ----
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
  // default path and params (customized per-test when needed)
  usePathnameMock.mockReturnValue('/en/assistant');
  useParamsMock.mockReturnValue({ lang: 'en' });
});

describe('RouteGate', () => {
  test('On first load (not fetched yet): dispatches fetchUser and renders fallback (no flash)', async () => {
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

    // Should render fallback while first fetch hasn’t completed
    expect(screen.getByTestId('fallback')).toBeInTheDocument();

    // The guard should auto-dispatch fetchUser once
    await waitFor(() =>
      expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: fetchUser.type })),
    );
  });

  test('Fetched=true & no profile on protected page → redirects to /{lang}/create-user-profile and hides children', async () => {
    // protected page
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

    // While redirecting, we still show fallback (no flash of children)
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  test('Fetched=true & has profile on create page → redirects to /{lang}/assistant', async () => {
    // create page
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

  test('Fetched=true & has profile on protected page → renders children (no redirect)', async () => {
    // protected page
    usePathnameMock.mockReturnValue('/en/assistant');
    useParamsMock.mockReturnValue({ lang: 'en' });

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

    // No redirect
    await new Promise((r) => setTimeout(r, 0));
    expect(replaceMock).not.toHaveBeenCalled();

    // Children are shown
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
