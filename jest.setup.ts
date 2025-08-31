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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockLink = React.forwardRef(({ children, href, ...props }: any, ref: any) => {
    return React.createElement('a', { href, ref, ...props }, children);
  });
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock LanguageContext with React state
jest.mock('./src/contexts/LanguageContext', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      children,
    );
  };

  return {
    useLanguage: () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Trans: ({ children, message }: any) => React.createElement('span', {}, message || children),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    I18nProvider: ({ children }: any) => children,
    useLingui: () => ({
      i18n: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        _: (id: string, _values?: any) => id,
        locale: 'en',
      },
    }),
  };
});

// Mock @lingui/core and src/i18n (they export the same i18n instance)
jest.mock('@lingui/core', () => ({
  i18n: {
    locale: 'en',
    activate: jest.fn(),
    load: jest.fn(),
    _: (id: string) => id,
  },
}));

jest.mock('./src/i18n', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { i18n } = require('@lingui/core');
  return { i18n };
});
