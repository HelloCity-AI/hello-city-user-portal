import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { I18nProvider } from '@/contexts/I18nProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { UserState } from '@/store/slices/user';
import { AuthState } from '@/store/slices/user';

// Create theme once at module level for better performance
const testTheme = createTheme();

// Mock messages for testing
const mockMessages = {
  en: {},
  zh: {},
};

// This is a wrapper component that provides language context for testing purposes
export const I18nTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>
    <I18nProvider initialLocale="en" initialMessages={mockMessages}>
      {children}
    </I18nProvider>
  </LanguageProvider>
);

// This is a wrapper component that provides MUI theme for testing purposes
export const withTheme = (ui: React.ReactNode) => {
  return <ThemeProvider theme={testTheme}>{ui}</ThemeProvider>;
};

// This is a wrapper that provides both MUI theme and language context for testing purposes.
export const TestProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Minimal Redux store to satisfy components using useSelector(state.user)
  const userState: UserState = {
    isLoading: false,
    data: null,
    error: null,
    authStatus: AuthState.Unauthenticated,
  };
  const store = configureStore({
    reducer: {
      user: () => userState,
    },
  });

  return (
    <Provider store={store}>
      <ThemeProvider theme={testTheme}>
        <LanguageProvider>
          <I18nProvider initialLocale="en" initialMessages={mockMessages}>
            {children}
          </I18nProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
};
