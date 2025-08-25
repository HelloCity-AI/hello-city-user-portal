import { useLanguage } from '@/contexts/LanguageContext';
import type { NavItem } from '@/components/NavBar/navConfig';

export const useNavItems = (): NavItem[] => {
  const { language, setLanguage } = useLanguage();

  return [
    {
      id: 'home',
      href: `/${language}`,
      label: 'Home',
    },
    {
      id: 'chat',
      href: `/${language}`,
      label: 'Chat',
      onClick: () => alert('chat'),
    },
    {
      id: 'contact',
      href: `/${language}`,
      label: 'Contact Us',
      onClick: () => alert('contact'),
    },
    {
      id: 'change language',
      href: '',
      label: 'Change Language',
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
