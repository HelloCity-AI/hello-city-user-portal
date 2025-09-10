'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from '@/contexts/I18nProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Box from '@mui/material/Box';
import { NavBar } from '@/components/NavBar';
import type { Messages } from '@lingui/core';
import { usePathname } from 'next/navigation';

type Props = {
  children: ReactNode;
  lang: string;
  messages: { [key: string]: Messages };
};

export default function ClientProviders({ children, lang, messages }: Props) {
  const pathname = usePathname();
  const hideNav = pathname?.includes('/contact-us');

  return (
    <I18nProvider initialLocale={lang} initialMessages={messages}>
      <LanguageProvider>
        {!hideNav && (
          <Box component="header">
            <NavBar />
          </Box>
        )}
        <Box component="main">{children}</Box>
      </LanguageProvider>
    </I18nProvider>
  );
}
