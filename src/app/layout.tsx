import './globals.css';
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import websiteTheme from '@/theme/theme';
import ReduxProvider from './ReduxProvider';
import ApiProvider from './ApiProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HelloCiti - Landing Assistant for new cities',
  description:
    'HelloCiti is an AI-powered landing assistant for international students, new immigrants, and travelers. It provides personalized checklists, timelines and document downloads to simplify visa processes, banking and housing and more — tackling fragmented information, language barriers, and complex procedures.',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get language from cookie set by middleware
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'en';

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={websiteTheme}>
              <CssBaseline />
              <ReduxProvider>
                <ApiProvider>
                  <div className="relative">{children}</div>
                </ApiProvider>
              </ReduxProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </AppRouterCacheProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
