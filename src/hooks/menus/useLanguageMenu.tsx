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

  const currentLanguage: LanguageInfo = SUPPORTED_LANGUAGES[language as SupportedLanguage];

  // Language options for dropdown
  const languageOptionsForDropdown: MenuOption[] = ALL_LANGUAGES.map((lang) => {
    const isSupported = availableLanguages.includes(lang.code);
    return {
      id: lang.code,
      label: lang.label,
      value: lang.code,
      onClick: isSupported ? () => setLanguage(lang.code) : () => alert('Coming soon'),
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
      onClick: isSupported ? () => setLanguage(lang.code) : () => alert('Coming soon'),
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
