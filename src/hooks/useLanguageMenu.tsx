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
 */
const useLanguageMenu = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  const currentLanguage: LanguageInfo = SUPPORTED_LANGUAGES[language as SupportedLanguage];

  // Build dropdown options directly without useMemo; the list is small and cheap to compute.
  const supportedDropdown = ALL_LANGUAGES.filter((l) => availableLanguages.includes(l.code)).map(
    (lang) => ({
      label: lang.label,
      value: lang.code,
      onClick: () => setLanguage(lang.code),
    }),
  );
  const placeholderDropdown = ALL_LANGUAGES.filter((l) => !availableLanguages.includes(l.code))
    .slice(0, 3)
    .map((lang) => ({
      label: lang.label,
      value: lang.code,
      onClick: () => alert('Coming soon'),
    }));
  const optionsForDropdown: MenuOption[] = [...supportedDropdown, ...placeholderDropdown];

  // Build drawer children items similarly
  const supportedChildren = ALL_LANGUAGES.filter((l) => availableLanguages.includes(l.code)).map(
    (lang) => ({
      id: lang.code,
      href: '',
      label: lang.label,
      onClick: () => setLanguage(lang.code),
    }),
  );
  const placeholderChildren = ALL_LANGUAGES.filter((l) => !availableLanguages.includes(l.code))
    .slice(0, 3)
    .map((lang) => ({
      id: lang.code,
      href: '',
      label: lang.label,
      onClick: () => alert('Coming soon'),
    }));
  const childrenNavItems: NavItem[] = [...supportedChildren, ...placeholderChildren];

  return {
    currentLanguage,
    shortLabel: currentLanguage.shortLabel,
    optionsForDropdown,
    childrenNavItems,
  };
};

export default useLanguageMenu;
