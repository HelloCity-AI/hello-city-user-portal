'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';

import {
  SUPPORTED_LANGUAGES,
  LOGO_CONFIG,
  type SupportedLanguage,
} from '../components/NavBar/navConfig';

const SUPPORTED_LANG_CODES = Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[];

function isSupportedLanguage(code: string | undefined): code is SupportedLanguage {
  return !!code && (SUPPORTED_LANG_CODES as readonly string[]).includes(code);
}

function buildLangHref(pathname: string, to: SupportedLanguage) {
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length === 0) return `/${to}`;
  const first = segs[0];
  const isLang = isSupportedLanguage(first);
  if (isLang) segs[0] = to;
  else segs.unshift(to);
  return `/${segs.join('/')}`;
}

const LANGUAGE_BUTTON_TEXT: Record<SupportedLanguage, string> = {
  en: 'Language',
  zh: '语言',
  'zh-TW': '語言',
  ja: '言語',
  ko: '언어',
};

const TEXT: Record<
  SupportedLanguage,
  {
    home: string;
    contact: string;
    notFoundTitle: string;
    notFoundDesc: string;
    goHome: string;
    contactUs: string;
    goBack: string;
    tried: string;
  }
> = {
  en: {
    home: 'Home',
    contact: 'Contact',
    notFoundTitle: 'This page could not be found.',
    notFoundDesc:
      'The page you’re looking for doesn’t exist, has been moved, or the URL is incorrect.',
    goHome: 'Go to Home',
    contactUs: 'Contact Us',
    goBack: 'Go Back',
    tried: 'Tried',
  },
  zh: {
    home: '首页',
    contact: '联系',
    notFoundTitle: '未找到该页面',
    notFoundDesc: '您访问的页面不存在、已被移动，或链接有误。',
    goHome: '返回首页',
    contactUs: '联系我们',
    goBack: '返回上一页',
    tried: '尝试访问',
  },
  'zh-TW': {
    home: '首頁',
    contact: '聯絡',
    notFoundTitle: '找不到此頁面',
    notFoundDesc: '您造訪的頁面不存在、已被移動，或連結有誤。',
    goHome: '回到首頁',
    contactUs: '聯絡我們',
    goBack: '返回上一頁',
    tried: '嘗試存取',
  },
  ja: {
    home: 'ホーム',
    contact: 'お問い合わせ',
    notFoundTitle: 'ページが見つかりません。',
    notFoundDesc: 'お探しのページは存在しないか、移動されたか、URL が正しくありません。',
    goHome: 'ホームへ',
    contactUs: 'お問い合わせ',
    goBack: '前のページへ',
    tried: '試行した URL',
  },
  ko: {
    home: '홈',
    contact: '문의',
    notFoundTitle: '페이지를 찾을 수 없습니다.',
    notFoundDesc: '찾고 있는 페이지가 존재하지 않거나 이동되었거나, URL이 올바르지 않습니다.',
    goHome: '홈으로',
    contactUs: '문의하기',
    goBack: '뒤로 가기',
    tried: '시도한 경로',
  },
};

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname() || '/';

  const firstSeg = pathname.split('/').filter(Boolean)[0];
  const lang: SupportedLanguage = isSupportedLanguage(firstSeg) ? firstSeg : 'en';

  const homeHref = `/${lang}`;
  const contactHref = `/${lang}/contact-us`;
  const t = TEXT[lang];
  const langInfo = SUPPORTED_LANGUAGES[lang];

  const [anchorLang, setAnchorLang] = React.useState<HTMLElement | null>(null);
  const openLangMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorLang(e.currentTarget);
  const closeLangMenu = () => setAnchorLang(null);

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="static"
        elevation={0}
        color="transparent"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }}>
          <Container
            maxWidth="lg"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                component="img"
                src={LOGO_CONFIG.dark}
                alt="HelloCity Logo"
                sx={{ height: { xs: 36, sm: 44, md: 52 }, width: 'auto', display: 'block' }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={langInfo.shortLabel} size="small" variant="outlined" />
              <Button size="small" onClick={openLangMenu}>
                {LANGUAGE_BUTTON_TEXT[lang]}
              </Button>
              <Menu anchorEl={anchorLang} open={Boolean(anchorLang)} onClose={closeLangMenu}>
                {SUPPORTED_LANG_CODES.map((l) => (
                  <MenuItem
                    key={l}
                    selected={l === lang}
                    component={Link}
                    href={buildLangHref(pathname, l)}
                    onClick={closeLangMenu}
                  >
                    {SUPPORTED_LANGUAGES[l].label}
                  </MenuItem>
                ))}
              </Menu>

              <Button component={Link} href={homeHref} size="small">
                {t.home}
              </Button>
              <Button component={Link} href={contactHref} size="small">
                {t.contact}
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'grid',
          placeItems: 'center',
          px: { xs: 2, sm: 3 },
          py: { xs: 8, sm: 12 },
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 4, md: 6 }}
            alignItems="center"
            justifyContent="center"
          >
            <Stack
              spacing={{ xs: 2, sm: 3 }}
              alignItems={{ xs: 'center', md: 'flex-end' }}
              textAlign={{ xs: 'center', md: 'right' }}
              sx={{ minWidth: { md: 280 } }}
            >
              <Typography
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '3.5rem', sm: '4.5rem', md: '6rem' },
                  lineHeight: 1.05,
                }}
              >
                404
              </Typography>
            </Stack>

            <Divider
              flexItem
              orientation="vertical"
              sx={{ display: { xs: 'none', md: 'block' } }}
            />

            <Stack
              spacing={{ xs: 2.5, sm: 3 }}
              maxWidth={720}
              textAlign={{ xs: 'center', md: 'left' }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.6rem', sm: '1.9rem', md: '2.2rem' },
                  lineHeight: 1.2,
                }}
              >
                {t.notFoundTitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', fontSize: { xs: '1rem', sm: '1.125rem' } }}
              >
                {t.notFoundDesc}
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems="center"
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <Button component={Link} href={homeHref} variant="contained" size="large">
                  {t.goHome}
                </Button>
                <Button component={Link} href={contactHref} variant="outlined" size="large">
                  {t.contactUs}
                </Button>
                <Button variant="outlined" size="large" onClick={() => router.back()}>
                  {t.goBack}
                </Button>
              </Stack>

              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {t.tried}: <code style={{ wordBreak: 'break-all' }}>{pathname}</code>
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: { xs: 3, sm: 4 }, borderTop: 1, borderColor: 'divider' }}>
        <Container
          maxWidth="lg"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} HelloCity. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              href={`/${lang}/create-user-profile`}
              size="small"
              color="inherit"
            >
              {lang === 'en'
                ? 'Create Profile'
                : lang === 'ja'
                  ? 'プロフィール作成'
                  : lang === 'ko'
                    ? '프로필 생성'
                    : '创建档案'}
            </Button>
            <Button component={Link} href={`/${lang}/`} size="small" color="inherit">
              {t.home}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
