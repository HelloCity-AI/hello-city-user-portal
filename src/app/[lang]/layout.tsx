import type { ReactNode } from 'react';
import type { Messages } from '@lingui/core';
import linguiConfig from '../../../lingui.config';
import { getAllMessages } from '@/appRouterI18n';
import ClientProviders from './ClientProviders';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return linguiConfig.locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout(props: Props) {
  const params = await props.params;

  const {
    children
  } = props;

  const { lang } = params;

  // Preload messages for all languages to avoid loading issues during language switching
  const allMessages: Record<string, Messages> = {};
  for (const locale of linguiConfig.locales) {
    allMessages[locale] = await getAllMessages(locale);
  }

  return (
    <ClientProviders lang={lang} messages={allMessages}>
      {children}
    </ClientProviders>
  );
}
