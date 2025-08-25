import { Trans } from '@lingui/react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { NavItem } from '@/components/NavBar/navConfig';

export const useNavItems = (): NavItem[] => {
  const { language, setLanguage } = useLanguage();

  return [
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
      href: `/${language}`,
      label: <Trans id="NavBar.ContactUs" message="Contact Us" />,
      onClick: () => alert('contact'),
    },
    {
      id: 'change language',
      href: '',
      label: <Trans id="NavBar.ChangeLanguage" message="Change Language" />,
      childrenItem: [
        { id: 'en', href: '', label: 'English', onClick: () => setLanguage('en') },
        { id: 'zh', href: '', label: '简体中文', onClick: () => setLanguage('zh') },
        { id: 'zh-TW', href: '', label: '繁體中文', onClick: () => alert('Coming soon') },
        { id: 'ja', href: '', label: '日本語', onClick: () => alert('Coming soon') },
        { id: 'ko', href: '', label: '한국어', onClick: () => alert('Coming soon') },
      ],
    },
  ];
};
