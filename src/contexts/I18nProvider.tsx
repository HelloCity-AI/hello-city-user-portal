'use client';

import { I18nProvider as LinguiI18nProvider } from '@lingui/react';
import { setupI18n } from '@lingui/core';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Messages } from '@lingui/core';
import { en, zh, ja, ko } from 'make-plural/plurals';

type Props = {
  children: ReactNode;
  initialLocale: string;
  initialMessages: { [key: string]: Messages };
};

export function I18nProvider({ children, initialLocale, initialMessages }: Props) {
  // Create isolated i18n instance for this Provider
  // Each language route gets its own instance - no global singleton conflicts
  const [i18n] = useState(() => {
    return setupI18n({
      locale: initialLocale,
      messages: initialMessages, // initialMessages already contains all languages
      localeData: {
        en: { plurals: en },
        zh: { plurals: zh },
        zh_TW: { plurals: zh }, // Taiwan uses same plural rules as mainland
        zh_CN: { plurals: zh },
        ja: { plurals: ja },
        ko: { plurals: ko },
      },
    });
  });

  return <LinguiI18nProvider i18n={i18n}>{children}</LinguiI18nProvider>;
}
