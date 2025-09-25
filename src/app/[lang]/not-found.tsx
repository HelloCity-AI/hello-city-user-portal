'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Trans, useLingui } from '@lingui/react';
import Script from 'next/script';

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

export default function NotFound() {
  const theme = useTheme();
  const { i18n } = useLingui();
  const pathname = usePathname() || '/';
  const pathLang = canon(pathname.split('/').filter(Boolean)[0]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    i18n.on('change', handler);
    return () => i18n.removeListener('change', handler);
  }, [i18n]);

  useEffect(() => {
    document.documentElement.classList.add('hide-nav');
    return () => {
      document.documentElement.classList.remove('hide-nav');
    };
  }, []);

  useEffect(() => {
    if (i18n.locale !== pathLang) {
      i18n.activate(pathLang);
    }
  }, [i18n, pathLang]);

  const lang = pathLang;
  const homeHref = `/${lang}`;
  const logoSrc = theme.palette.mode === 'dark' ? LOGO_CONFIG.light : LOGO_CONFIG.dark;

  return (
    <>
      <style jsx global>{`
        html.hide-nav header {
          display: none !important;
        }
      `}</style>

      <Box
        component="main"
        key={`${tick}-${lang}`}
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
                <Box
                  component="img"
                  src={logoSrc}
                  alt="HelloCity"
                  sx={{
                    height: { xs: 84, sm: 96, md: 108 },
                    width: 'auto',
                    display: 'block',
                    opacity: 0.96,
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </Box>

              <Divider
                flexItem
                orientation="vertical"
                sx={{ display: { xs: 'none', md: 'block' } }}
              />

              <Typography
                aria-label="404"
                sx={(th) => ({
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  fontSize: { xs: '4.5rem', sm: '6rem', md: '7.5rem' },
                  lineHeight: 1,
                  textAlign: 'center',
                  backgroundImage: `linear-gradient(90deg, ${th.palette.primary.main}, ${th.palette.info.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: `0 6px 28px ${th.palette.primary.main}40`,
                })}
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
