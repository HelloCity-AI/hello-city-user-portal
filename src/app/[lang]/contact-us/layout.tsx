import { ReactNode } from 'react';
import { getAllMessages } from '@/appRouterI18n';
import ClientWrapper from './ClientWrapper';



export default async function ContactUsLayout({ children, params }: { children: ReactNode; params: { lang: string } }) {
  const messages = await getAllMessages(params.lang);

  console.log("✅ ContactUs layout loaded with lang:", params.lang);


  return (
    <ClientWrapper lang={params.lang} messages={messages}>
      {children}
    </ClientWrapper>
  );
}
