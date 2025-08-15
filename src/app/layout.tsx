import './globals.css';
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata } from 'next';

import NavBar from '@/components/NavBar';
import websiteTheme from '@/theme/theme';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { I18nProvider } from '@/contexts/I18nProvider';
import ProviderRedux from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HelloCity - Landing Assistant for new cities',
  description:
    'HelloCity is an AI-powered landing assistant for international students, new immigrants, and travelers. It provides personalized checklists, timelines and document downloads to simplify visa processes, banking and housing and more — tackling fragmented information, language barriers, and complex procedures.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={websiteTheme}>
              <CssBaseline />
              <ProviderRedux>
                <div className="relative">{children}</div>
              </ProviderRedux>
              <div className="relative">{children}</div>
            </ThemeProvider>
          </StyledEngineProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
