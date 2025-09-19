'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import {
  SUPPORTED_LANGUAGES,
  LOGO_CONFIG,
  type SupportedLanguage,
} from '@/components/NavBar/navConfig';

const SUPPORTED_LANG_CODES = Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[];
const LOWER_TO_CANON = SUPPORTED_LANG_CODES.reduce(
  (acc, code) => {
    acc[code.toLowerCase()] = code;
    return acc;
  },
  {} as Record<string, SupportedLanguage>,
);
const canonicalize = (code?: string): SupportedLanguage | null =>
  code ? (LOWER_TO_CANON[code.toLowerCase()] ?? null) : null;

const TEXT: Record<SupportedLanguage, { notFound: string; headline: string; sub: string }> = {
  en: {
    notFound: 'Page not found',
    headline: 'Let’s help you settle in.',
    sub: 'HelloCity supports everyone with housing, banking, transport and community—so your new life starts smoothly.',
  },
  zh: {
    notFound: '未找到该页面',
    headline: '让我们帮你更快融入新生活。',
    sub: 'HelloCity 为每一个人提供住宿、开户、出行与社区支持，让你的海外生活更顺利开启。',
  },
  'zh-TW': {
    notFound: '找不到此頁面',
    headline: '讓我們幫你更快融入新生活。',
    sub: 'HelloCity 為每個人提供住宿、開戶、交通與社群支援，協助你順利展開海外生活。',
  },
  ja: {
    notFound: 'ページが見つかりません',
    headline: '新しい暮らしへの一歩をサポートします。',
    sub: 'HelloCity はすべての人の住まい・銀行口座・交通・コミュニティ参加を支援し、スムーズな新生活を実現します。',
  },
  ko: {
    notFound: '페이지를 찾을 수 없습니다',
    headline: '새로운 나라에서의 정착을 도와드립니다.',
    sub: 'HelloCity는 모든 사람의 주거, 계좌 개설, 교통, 커뮤니티 참여를 지원하여 부드러운 시작을 돕습니다.',
  },
};

export default function NotFound() {
  const theme = useTheme();
  const pathname = usePathname() || '/';

  const firstSeg = pathname.split('/').filter(Boolean)[0];
  const lang: SupportedLanguage = canonicalize(firstSeg) ?? 'en';
  const t = TEXT[lang];

  const logoSrc = theme.palette.mode === 'dark' ? LOGO_CONFIG.light : LOGO_CONFIG.dark;

  return (
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
              href={`/${lang}`}
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
              {t.notFound}
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
              {t.headline}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.125rem' } }}
            >
              {t.sub}
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
