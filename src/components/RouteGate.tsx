'use client';

import React, { useEffect, useRef } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { fetchUser, AuthState } from '@/store/slices/user';
import { on } from 'events';

type RouteGateProps = {
  children: React.ReactNode;
  requireProfile?: boolean;
  redirectIfHasProfile?: boolean;
  suspendUntilReady?: boolean;
  loadingFallback?: React.ReactNode;
  autoFetch?: boolean;
};

const RouteGate: React.FC<RouteGateProps> = ({
  children,
  requireProfile = true,
  redirectIfHasProfile = true,
  suspendUntilReady = true,
  loadingFallback = null,
  autoFetch = true,
}) => {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const { lang: langParam } = useParams<{ lang?: string }>();
  const lang = (langParam || pathname.split('/')[1] || 'en').trim();

  const dispatch = useDispatch();
  const { isLoading, hasFetched, authStatus } = useSelector((s: RootState) => s.user);

  const createPath = `/${lang}/create-user-profile`;
  const homePath = `/${lang}/assistant`;
  const onCreatePage = pathname.startsWith(createPath);
  const onAssistantPage = pathname.startsWith(homePath);

  const requestedRef = useRef(false);
  useEffect(() => {
    if (!autoFetch || requestedRef.current) return;
    if (!hasFetched && !isLoading) {
      requestedRef.current = true;
      dispatch(fetchUser());
    }
  }, [autoFetch, hasFetched, isLoading, dispatch]);

  const isReady = authStatus === AuthState.AuthenticatedWithProfile;

  const willRedirectToCreate =
    hasFetched &&
    !isLoading &&
    requireProfile &&
    !onCreatePage &&
    authStatus === AuthState.AuthenticatedButNoProfile;

  const willRedirectHomeFromProtected =
    hasFetched &&
    !isLoading &&
    requireProfile &&
    !onCreatePage &&
    authStatus !== AuthState.AuthenticatedWithProfile &&
    authStatus !== AuthState.AuthenticatedButNoProfile &&
    !onAssistantPage;

  const willRedirectHomeFromCreate =
    hasFetched && !isLoading && redirectIfHasProfile && onCreatePage && isReady;

  useEffect(() => {
    if (!hasFetched || isLoading) return;

    if (willRedirectToCreate) {
      router.replace(createPath);
      return;
    }
    if (willRedirectHomeFromProtected || willRedirectHomeFromCreate) {
      router.replace(homePath);
    }
  }, [
    hasFetched,
    isLoading,
    willRedirectToCreate,
    willRedirectHomeFromProtected,
    willRedirectHomeFromCreate,
    router,
    createPath,
    homePath,
  ]);

  // ---------- stage of rendering ----------
  // 1) first state: still loading first fetch
  if (suspendUntilReady && isLoading) {
    return <>{loadingFallback}</>;
  }
  // 2) first fetch completed, but about to redirect: hide (avoid rendering a frame of children before jumping)
  if (
    suspendUntilReady &&
    (willRedirectToCreate || willRedirectHomeFromProtected || willRedirectHomeFromCreate)
  ) {
    return <>{loadingFallback}</>;
  }

  // 3) only render children if "allowed to enter"
  return <>{children}</>;
};

export default RouteGate;
