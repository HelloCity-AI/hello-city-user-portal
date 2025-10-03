import Link from 'next/link';
import { cookies } from 'next/headers';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import { getServerTranslation } from '@/utils/serverI18n';

import {
  SUPPORTED_LANGUAGES,
  LOGO_CONFIG,
  type SupportedLanguage,
} from '../../compoundComponents/NavBar/navConfig';

function detectLocaleFromCookie(): SupportedLanguage {
  const want = (cookies().get('lang')?.value || 'en').toLowerCase();
  const keys = Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[];
  const hit = keys.find(k => k.toLowerCase() === want);
  return hit ?? 'en';
}

export default async function NotFound() {
  const locale = detectLocaleFromCookie();
  const { t } = await getServerTranslation(locale);

  const homeHref = `/${locale}`;

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

              <Divider flexItem orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />

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

            <Stack spacing={{ xs: 1.5, sm: 2 }} alignItems="center" textAlign="center" sx={{ maxWidth: 720 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('notFound.pageNotFound', 'Page not found')}
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
                {t('notFound.headline', "Let's help you settle in.")}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.125rem' } }}>
                {t(
                  'notFound.sub',
                  'HelloCity supports international students with housing, banking, transport and community—so your new life starts smoothly.'
                )}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
