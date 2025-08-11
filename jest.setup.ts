import '@testing-library/jest-dom';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  const React = require('react');
  return function MockLink({ children, href, ...props }: any) {
    return React.createElement('a', { href, ...props }, children);
  };
});

// Mock LanguageContext with React state
jest.mock('./src/contexts/LanguageContext', () => {
  const React = require('react');
  
  const MockLanguageProvider = ({ children }: any) => {
    const [language, setLanguage] = React.useState('en');
    
    const contextValue = {
      language,
      setLanguage,
      isLanguage: (lang: string) => language === lang,
      availableLanguages: ['en', 'zh'],
    };
    
    return React.createElement(
      React.createContext(contextValue).Provider,
      { value: contextValue },
      children
    );
  };
  
  return {
    useLanguage: () => {
      const React = require('react');
      const [language, setLanguage] = React.useState('en');
      return {
        language,
        setLanguage,
        isLanguage: (lang: string) => language === lang,
        availableLanguages: ['en', 'zh'],
      };
    },
    LanguageProvider: MockLanguageProvider,
  };
});

// Mock @lingui/react
jest.mock('@lingui/react', () => {
  const React = require('react');
  return {
    Trans: ({ children, message }: any) => React.createElement('span', {}, message || children),
    I18nProvider: ({ children }: any) => children,
    useLingui: () => ({
      i18n: {
        _: (id: string, values?: any) => id,
        locale: 'en',
      },
    }),
  };
});

// Mock @lingui/core
jest.mock('@lingui/core', () => ({
  i18n: {
    locale: 'en',
    activate: jest.fn(),
    load: jest.fn(),
    _: (id: string) => id,
  },
}));

// Mock the i18n module
jest.mock('./src/i18n', () => ({
  i18n: {
    locale: 'en',
    activate: jest.fn(),
    load: jest.fn(),
    _: (id: string) => id,
  },
}));