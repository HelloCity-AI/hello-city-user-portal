// TODO:TODO: Re-enable language-aware routing after chat page implementation
// import { useLanguage } from '@/contexts/LanguageContext';
import { Trans } from '@lingui/react';

export const useTryHelloCity = () => {
  // const { language } = useLanguage();

  // TODO: Add sign-in status check to conditionally return different href
  // - If signed in: return `/${language}/chat` (when chat page is created)
  // - If not signed in: return sign-in flow

  return {
    // href: `/${language}`,
    // for debug purpose,
    href: '/auth/logout',
    label: <Trans id="NavBar.Try HelloCity" message="Try HelloCity" />,
  };
};
