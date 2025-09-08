import { auth0 } from '@/lib/auth0';
import React, { type ReactNode } from 'react';
import StoreProvider from './StoreProvider';
import AuthProvider from './AuthProvider';

const ReduxProvider = async ({ children }: { children: ReactNode }) => {
  const accessToken = await auth0.getAccessToken();

  return (
    <StoreProvider>
      <AuthProvider accessToken={accessToken?.token ? accessToken.token : null}>
        {children}
      </AuthProvider>
    </StoreProvider>
  );
};

export default ReduxProvider;
