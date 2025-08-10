import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { I18nProvider } from '@/contexts/I18nProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// This is a wrapper component that provides language context for testing purposes
export const I18nTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>
    <I18nProvider>{children}</I18nProvider>
  </LanguageProvider>
);

// This is a wrapper component that provides MUI theme for testing purposes
export const withTheme = (ui: React.ReactNode) => {
  const theme = createTheme();
  return <ThemeProvider theme={theme}>{ui}</ThemeProvider>;
};
