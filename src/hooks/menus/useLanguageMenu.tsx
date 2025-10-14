'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import {
  SUPPORTED_LANGUAGES,
  type NavItem,
  type SupportedLanguage,
  type LanguageInfo,
} from '@/compoundComponents/NavBar/navConfig';
import type { MenuOption } from '@/types/menu';

// Static list of all languages derived once at module load.
const ALL_LANGUAGES: LanguageInfo[] = Object.values(SUPPORTED_LANGUAGES);

/**
 * Single-source language menu builder for NavBar, sidebars, etc.
 * - Derives options from SUPPORTED_LANGUAGES filtered by LanguageProvider.availableLanguages
 * - Exposes both Dropdown options and NavItem children for drawer menus
 * - TODO: Integrate drawer and dropdown props into single data structure
 */
const useLanguageMenu = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  // Update preferred language in backend via Next.js API route
  const updatePreferredLanguage = async (langCode: SupportedLanguage) => {
    try {
      const backendCode = (langCode as string).replace('-', '_');
      void fetch('/api/user/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferredLanguage: backendCode }),
      }).catch(() => {
        // ignore errors to keep UX smooth
      });
    } catch {
      // no-op
    }
  };

  const currentLanguage: LanguageInfo = SUPPORTED_LANGUAGES[language as SupportedLanguage];

  // Language options for dropdown
  const languageOptionsForDropdown: MenuOption[] = ALL_LANGUAGES.map((lang) => {
    const isSupported = availableLanguages.includes(lang.code);
    return {
      id: lang.code,
      label: lang.label,
      value: lang.code,
      onClick: isSupported
        ? () => {
            updatePreferredLanguage(lang.code);
            setLanguage(lang.code);
          }
        : () => alert('Coming soon'),
      icon: null,
      divider: false,
    };
  });

  // Language options for drawer
  const languageOptionsForDrawer: NavItem[] = ALL_LANGUAGES.map((lang) => {
    const isSupported = availableLanguages.includes(lang.code);
    return {
      id: lang.code,
      href: '',
      label: lang.label,
      onClick: isSupported
        ? () => {
            updatePreferredLanguage(lang.code);
            setLanguage(lang.code);
          }
        : () => alert('Coming soon'),
      childrenItem: undefined,
    };
  });

  return {
    currentLanguage,
    shortLabel: currentLanguage.shortLabel,
    languageOptionsForDropdown,
    languageOptionsForDrawer,
  };
};

export default useLanguageMenu;
