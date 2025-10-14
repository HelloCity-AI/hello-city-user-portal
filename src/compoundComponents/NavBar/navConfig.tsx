import type { ReactNode } from 'react';

export interface NavItem {
  id: string;
  href: string;
  label: ReactNode;
  onClick?: () => void;
  childrenItem?: NavItem[];
}

export type SupportedLanguage = 'en' | 'zh_CN' | 'zh_TW' | 'ja' | 'ko';

export interface LanguageInfo {
  code: SupportedLanguage;
  label: string;
  shortLabel: string; // for display in button like "EN", "中文"
}

export interface NavConfig {
  currentLanguage: LanguageInfo;
  logo: {
    light: string;
    dark: string;
    href: string;
  };
  navItems: NavItem[];
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
  en: { code: 'en', label: 'English', shortLabel: 'EN' },
  zh_CN: { code: 'zh_CN', label: '简体中文', shortLabel: '中文' },
  zh_TW: { code: 'zh_TW', label: '繁體中文', shortLabel: '繁中' },
  ja: { code: 'ja', label: '日本語', shortLabel: '日本語' },
  ko: { code: 'ko', label: '한국어', shortLabel: '한국' },
};

export const LOGO_CONFIG = {
  light: '/images/logo.png',
  dark: '/images/logo-dark.png',
  avatarLight: '/images/logo-avatar.png',
} as const;
