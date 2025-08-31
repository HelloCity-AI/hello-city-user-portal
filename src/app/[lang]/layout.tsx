import type { ReactNode } from 'react';
import linguiConfig from '../../../lingui.config';
import { getAllMessages } from '@/appRouterI18n';
import ClientProviders from './ClientProviders';

type Props = {
  children: ReactNode;
  params: { lang: string };
};

export function generateStaticParams() {
  return linguiConfig.locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = params;

  // Preload messages for all languages to avoid loading issues during language switching
  const allMessages: Record<string, any> = {};
  for (const locale of linguiConfig.locales) {
    allMessages[locale] = await getAllMessages(locale);
  }

  return (
    <ClientProviders lang={lang} messages={allMessages}>
      {children}
    </ClientProviders>
  );
}
