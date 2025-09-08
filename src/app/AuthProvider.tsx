'use client';

import React, { useEffect, type ReactNode } from 'react';
import { fetchUser } from '@/store/slices/user';
import { useDispatch } from 'react-redux';

interface AuthProviderProps {
  accessToken: string | null;
  children: ReactNode;
}

const AuthProvider = ({ accessToken, children }: AuthProviderProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!accessToken) return;

    dispatch(fetchUser(accessToken));
  }, [accessToken, dispatch]);

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProvider;
