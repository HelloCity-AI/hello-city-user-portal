'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/contexts/I18nProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import type { Messages } from '@lingui/core';

type Props = {
  children: ReactNode;
  lang: string;
  messages: { [key: string]: Messages };
};

export default function ClientProviders({ children, lang, messages }: Props) {
  return (
    <I18nProvider initialLocale={lang} initialMessages={messages}>
      <LanguageProvider>{children}</LanguageProvider>
    </I18nProvider>
  );
}
