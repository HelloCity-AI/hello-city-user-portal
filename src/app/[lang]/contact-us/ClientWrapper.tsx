'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';

console.log('✅ ClientWrapper file imported');

type Props = {
  children: ReactNode;
  lang: string;
  messages: any;
};

export default function ClientWrapper({ children, lang, messages }: Props) {
  useEffect(() => {
    console.log('✅ 当前语言:', lang);

    if (messages) {
      const finalMessages = messages.messages || messages;
      console.log('✅ messages keys:', Object.keys(finalMessages).slice(0, 10));
      console.log('✅ Loaded messages for', lang, finalMessages);

      i18n.load(lang, finalMessages);
      i18n.activate(lang);
      console.log('✅ 已激活语言:', lang);
    }
  }, [lang, messages]);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
