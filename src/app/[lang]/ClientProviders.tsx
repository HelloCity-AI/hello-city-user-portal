'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/contexts/I18nProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NavBar } from '@/components/NavBar';

type Props = {
  children: ReactNode;
  lang: string;
  messages: Record<string, unknown>;
};

export default function ClientProviders({ children, lang, messages }: Props) {
  return (
    <I18nProvider initialLocale={lang} initialMessages={messages}>
      <LanguageProvider>
        <NavBar />
        {children}
      </LanguageProvider>
    </I18nProvider>
  );
}
