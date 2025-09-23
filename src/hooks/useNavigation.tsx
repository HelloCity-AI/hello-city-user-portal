import { Trans } from '@lingui/react';
import { useLanguage } from '@/contexts/LanguageContext';
import type {
  NavItem,
  NavConfig,
  SupportedLanguage,
  LanguageInfo,
} from '@/compoundComponents/NavBar/navConfig';
import { SUPPORTED_LANGUAGES, LOGO_CONFIG } from '@/compoundComponents/NavBar/navConfig';

export const useNavigation = (): NavConfig => {
  const { language } = useLanguage();

  const currentLanguage: LanguageInfo = SUPPORTED_LANGUAGES[language as SupportedLanguage];
  const navItems: NavItem[] = [
    {
      id: 'home',
      href: `/${language}`,
      label: <Trans id="NavBar.Home" message="Home" />,
    },
    {
      id: 'chat',
      href: `/${language}`,
      label: <Trans id="NavBar.Chat" message="Chat" />,
      onClick: () => alert('chat'),
    },
    {
      id: 'contact',
      href: `/${language}/contact-us`,
      label: <Trans id="NavBar.ContactUs" message="Contact Us" />,
    },
  ];

  return {
    currentLanguage,
    logo: {
      light: LOGO_CONFIG.light,
      dark: LOGO_CONFIG.dark,
      href: `/${language}/`,
    },
    navItems,
  };
};
