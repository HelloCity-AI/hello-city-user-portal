import type { ReactNode } from 'react';
import { getAllMessages } from '@/appRouterI18n';
import ClientProvider from '../ClientProviders';

export default async function ContactUsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const messages = await getAllMessages(params.lang);

  console.log('✅ ContactUs layout loaded with lang:', params.lang);

  return (
    <ClientProvider lang={params.lang} messages={messages}>
      {children}
    </ClientProvider>
  );
}
