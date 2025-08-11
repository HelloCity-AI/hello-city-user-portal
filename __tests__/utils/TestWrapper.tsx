import React from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { I18nProvider } from '@/contexts/I18nProvider';

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
