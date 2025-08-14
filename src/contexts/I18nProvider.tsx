'use client';

import { I18nProvider as LinguiI18nProvider } from '@lingui/react';
import { i18n } from '@/i18n';
import type { ReactNode } from 'react';

export function I18nProvider({ children }: { children: ReactNode }) {
  return <LinguiI18nProvider i18n={i18n}>{children}</LinguiI18nProvider>;
}
