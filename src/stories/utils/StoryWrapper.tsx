import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { I18nProvider } from '@/contexts/I18nProvider';
import websiteTheme from '@/theme/theme';

export const I18nStoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>
    <I18nProvider>{children}</I18nProvider>
  </LanguageProvider>
);

export const ThemeStoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={websiteTheme}>{children}</ThemeProvider>
);

export const FullStoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={websiteTheme}>
    <LanguageProvider>
      <I18nProvider>{children}</I18nProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default FullStoryWrapper;
