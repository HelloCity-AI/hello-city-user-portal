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
  const { language, setLanguage } = useLanguage();

  const currentLanguage: LanguageInfo = SUPPORTED_LANGUAGES[language as SupportedLanguage];
  const availableLanguages: LanguageInfo[] = Object.values(SUPPORTED_LANGUAGES);

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
    {
      id: 'change language',
      href: '',
      label: <Trans id="NavBar.ChangeLanguage" message="Change Language" />,
      childrenItem: availableLanguages.map((lang) => ({
        id: lang.code,
        href: '',
        label: lang.label,
        onClick: () => {
          if (lang.code === 'en' || lang.code === 'zh') {
            setLanguage(lang.code);
          } else {
            alert('Coming soon');
          }
        },
      })),
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
