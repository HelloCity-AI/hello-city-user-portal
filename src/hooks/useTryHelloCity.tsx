import { useLanguage } from '@/contexts/LanguageContext';
import { Trans } from '@lingui/react';

export const useTryHelloCity = () => {
  const { language } = useLanguage();

  return {
    href: `/${language}/assistant`,
    label: <Trans id="NavBar.Try HelloCity" message="Try HelloCity" />,
  };
};
