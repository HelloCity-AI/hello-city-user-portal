import Link from 'next/link';
import { headers, cookies } from 'next/headers';
import Negotiator from 'negotiator';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import { Trans } from '@lingui/react';
import { setI18n } from '@lingui/react/server';
import { i18n } from '@lingui/core';

import {
  SUPPORTED_LANGUAGES,
  LOGO_CONFIG,
  type SupportedLanguage,
} from '../../compoundComponents/NavBar/navConfig';

const SUPPORTED = Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[];
const LOWER_TO_CANON = SUPPORTED.reduce(
  (acc, c) => {
    acc[c.toLowerCase()] = c;
    return acc;
  },
  {} as Record<string, SupportedLanguage>,
);
const canon = (code?: string): SupportedLanguage =>
  LOWER_TO_CANON[(code || 'en').toLowerCase()] ?? 'en';

function detectLocale(): SupportedLanguage {
  const cookieLang = cookies().get('lang')?.value;
  if (cookieLang && LOWER_TO_CANON[cookieLang.toLowerCase()]) {
    return canon(cookieLang);
  }
  const accept = headers().get('accept-language') ?? '';
  const nego = new Negotiator({ headers: { 'accept-language': accept } });
  const match = nego.language(SUPPORTED as string[]) as string | null;
  return canon(match ?? 'en');
}

export default async function NotFound() {
  const locale = detectLocale();
  const catalog =
    (await import(`../../locales/${locale}/messages.mjs`).catch(() => null)) ??
    (await import(`../../locales/en/messages.mjs`));

  i18n.load(locale, (catalog as any).messages);
  i18n.activate(locale);
  setI18n(i18n);

  const homeHref = '/';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `header{display:none!important}` }} />

      <Box
        component="main"
        sx={{
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 8, sm: 12 },
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 100%)',
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 3, md: 4 }}
              alignItems="center"
              justifyContent="center"
              sx={{ width: '100%' }}
            >
              <Box
                component={Link}
                href={homeHref}
                aria-label="HelloCity Home"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <picture>
                  <source srcSet={LOGO_CONFIG.light} media="(prefers-color-scheme: dark)" />
                  <img
                    src={LOGO_CONFIG.dark}
                    alt="HelloCity"
                    style={{ height: '96px', width: 'auto', display: 'block', opacity: 0.96 }}
                  />
                </picture>
              </Box>

              <Divider
                flexItem
                orientation="vertical"
                sx={{ display: { xs: 'none', md: 'block' } }}
              />

              <Typography
                aria-label="404"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  fontSize: { xs: '4.5rem', sm: '6rem', md: '7.5rem' },
                  lineHeight: 1,
                  textAlign: 'center',
                  backgroundImage: 'linear-gradient(90deg, #1976d2, #64b5f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 6px 28px rgba(25,118,210,0.25)',
                }}
              >
                404
              </Typography>
            </Stack>

            <Stack
              spacing={{ xs: 1.5, sm: 2 }}
              alignItems="center"
              textAlign="center"
              sx={{ maxWidth: 720 }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <Trans id="notFound.pageNotFound" message="Page not found" />
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.6rem', sm: '1.9rem', md: '2.1rem' },
                  lineHeight: 1.15,
                }}
              >
                <Trans id="notFound.headline" message="Let's help you settle in." />
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.125rem' } }}
              >
                <Trans
                  id="notFound.sub"
                  message="HelloCity supports international students with housing, banking, transport and community—so your new life starts smoothly."
                />
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
