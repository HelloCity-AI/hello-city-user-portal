import type { ReactNode } from 'react';
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { I18nProvider } from '@/contexts/I18nProvider';
import websiteTheme from '@/theme/theme';

const mockMessages = {
  en: {
    'file.upload.error': 'Invalid File size or type. Please upload an image file under 5MB',
    'file.upload.progress': 'The image is uploading ...',
    'file.upload.success': 'The image is uploaded',
  },
};

export const emptyMessages = {
  en: {},
};
type Messages = {
  [locale: string]: {
    [key: string]: string;
  };
};

interface I18nStoryWrapperProps {
  initialLocale?: string;
  initialMessages?: Messages;
  children: ReactNode;
}

export const I18nStoryWrapper: React.FC<I18nStoryWrapperProps> = ({
  children,
  initialLocale = 'en',
  initialMessages = emptyMessages,
}) => (
  <I18nProvider initialLocale={initialLocale} initialMessages={initialMessages}>
    {children}
  </I18nProvider>
);

export const ThemeStoryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={websiteTheme}>{children}</ThemeProvider>
);

export const FullStoryWrapper: React.FC<I18nStoryWrapperProps> = ({
  children,
  initialLocale = 'en',
  initialMessages = emptyMessages,
}) => (
  <ThemeProvider theme={websiteTheme}>
    <I18nProvider initialLocale={initialLocale} initialMessages={initialMessages}>
      {children}
    </I18nProvider>
  </ThemeProvider>
);

export default FullStoryWrapper;
