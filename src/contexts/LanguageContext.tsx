'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import linguiConfig from '../../lingui.config';
import { i18n } from '../i18n';

type Language = string;

const LANGUAGES = {
  en: { name: 'English', nativeName: 'English' },
  zh: { name: 'Chinese', nativeName: '中文' },
} as const;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isLanguage: (lang: Language) => boolean;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Extract current language from pathname
  const pathSegments = pathname.split('/');
  const language: Language =
    pathSegments[1] && linguiConfig.locales.includes(pathSegments[1])
      ? (pathSegments[1] as Language)
      : (linguiConfig.sourceLocale as Language);

  // Activate the current language when language changes
  useEffect(() => {
    if (i18n.locale !== language) {
      // Only activate if the language is different
      // The messages should already be loaded by I18nProvider
      i18n.activate(language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (!linguiConfig.locales.includes(lang)) {
      console.warn(`Unsupported language: ${lang}`);
      return;
    }

    // Replace the current language in the pathname
    const segments = pathname.split('/');
    segments[1] = lang;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const isLanguage = (lang: Language) => language === lang;

  const availableLanguages = linguiConfig.locales;
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isLanguage,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
