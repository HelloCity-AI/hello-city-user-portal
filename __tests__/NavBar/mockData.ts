import type { NavItem, NavConfig } from '@/compoundComponents/NavBar/navConfig';

export const mockNavItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/en', onClick: jest.fn() },
  { id: 'chat', label: 'Chat', href: '', onClick: jest.fn() },
  { id: 'contact', label: 'Contact Us', href: '', onClick: jest.fn() },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
    onClick: jest.fn(),
    childrenItem: [
      { id: 'web', label: 'Web Dev', href: '/web', onClick: jest.fn() },
      { id: 'mobile', label: 'Mobile Dev', href: '/mobile', onClick: jest.fn() },
    ],
  },
  {
    id: 'change language',
    label: 'Language',
    href: '',
    onClick: jest.fn(),
    childrenItem: [
      { id: 'en', label: 'English', href: '', onClick: jest.fn() },
      { id: 'zh', label: '中文', href: '', onClick: jest.fn() },
    ],
  },
];

export const mockNavConfig: NavConfig = {
  currentLanguage: { code: 'en', label: 'English', shortLabel: 'EN' },
  logo: {
    light: '/images/Logo.png',
    dark: '/images/logo-dark.png',
    href: '/en/',
  },
  navItems: mockNavItems,
};
