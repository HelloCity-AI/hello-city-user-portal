'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trans } from '@lingui/react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTryHelloCity } from '@/hooks/useTryHelloCity';
import { Dropdown } from '..';
import { userMenuOptions } from '../dropdownMenuOptions.example';
import SectionContent from '../HomepageSections/SectionContent';
// eslint-disable-next-line import/no-named-as-default
import clsx from 'clsx';
import type { NavBarProps } from './NavBar';

const SCROLL_THRESHOLD = 30;
const BASE_CLASSES = 'fixed left-0 top-0 z-50 w-[100vw] items-center py-2 flex';
const TRANSITION_CLASSES = 'transition-all duration-300 ease-in-out';
const LOGO_PATHS = {
  light: '/images/Logo.png',
  dark: '/images/logo-dark.png',
} as const;

const DesktopNavBar: React.FC<NavBarProps> = ({ hasSignedIn, navItems }) => {
  const [hasBgColor, setHasBgColor] = useState<boolean>(false);
  const { language, isLanguage } = useLanguage();
  const { href: tryHelloCityHref, label: tryHelloCityLabel } = useTryHelloCity();
  const isEnglish = isLanguage('en');
  const scrollYRef = useRef(0);

  const backgroundClasses = hasBgColor ? 'bg-white/90 shadow-md' : 'bg-transparent shadow-none';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (timer) return;

      timer = setTimeout(() => {
        scrollYRef.current = window.scrollY;
        const shouldHaveBackground = scrollYRef.current > SCROLL_THRESHOLD;

        if (shouldHaveBackground !== hasBgColor) {
          setHasBgColor(shouldHaveBackground);
        }
        timer = null;
      }, 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearTimeout(timer);
    };
  }, [hasBgColor]);

  const languageNavItem = navItems.find((item) => item.id === 'change language');
  const languageOptions =
    languageNavItem?.childrenItem?.map((child) => ({
      label: child.label,
      value: child.id,
      onClick: child.onClick || (() => {}),
    })) || [];

  const renderLogo = () => (
    <Box component="div" data-section="logo" className="relative h-[30px] w-[120px]">
      <Link href="/">
        <Image
          src={hasBgColor ? LOGO_PATHS.dark : LOGO_PATHS.light}
          alt="HelloCity Logo"
          fill
          className="object-contain"
        />
      </Link>
    </Box>
  );

  const renderNavigationLinks = () => (
    <Box
      data-section="navigation-desktop"
      className="col-span-2 flex items-center justify-start gap-4"
    >
      {navItems.map((navItem) => {
        if (navItem.id === 'change language') return;
        return (
          <Button
            key={navItem.id}
            href={navItem.href || `/${language}`}
            component={Link}
            variant="tertiary"
            sx={{ color: `${hasBgColor && 'secondary.contrastText'}`, fontWeight: 600 }}
          >
            {navItem.label}
          </Button>
        );
      })}
    </Box>
  );

  const renderAuthSection = () => {
    if (hasSignedIn) {
      return (
        <Dropdown
          anchorElContent={
            <Avatar
              sx={{ width: 40, height: 40, cursor: 'pointer' }}
              src="/images/banner-image.jpeg"
              alt="User Avatar"
              role="button"
              aria-label="User menu"
            />
          }
          dropdownOptions={userMenuOptions}
          showUserLabel
        />
      );
    }

    return (
      <Button
        component={Link}
        href={'/auth/login'}
        variant="tertiary"
        sx={{ color: `${hasBgColor && 'secondary.contrastText'}` }}
        className="whitespace-nowrap font-semibold"
      >
        <Trans id="NaveBar.Sign In" message="Sign In" />
      </Button>
    );
  };

  const renderUserActions = () => (
    <Box
      component="div"
      data-section="user-actions"
      className="flex items-center justify-end gap-3"
    >
      <Dropdown
        anchorElContent={
          // Set button component to div to avoiding button being nested in button
          <Button
            component="div"
            variant="tertiary"
            sx={{
              color: hasBgColor ? 'secondary.contrastText' : 'white',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1,
            }}
            aria-label="Change language"
          >
            <LanguageOutlinedIcon aria-hidden="true" />
            {isEnglish ? 'EN' : 'CN'}
          </Button>
        }
        dropdownOptions={languageOptions}
        layout="horizontal"
        disableHover={true}
        textAlignCenter
      />
      {renderAuthSection()}
      <Button
        component={Link}
        href={tryHelloCityHref}
        variant="primary"
        className="min-w-fit flex-shrink-0 whitespace-nowrap text-nowrap font-semibold"
      >
        {tryHelloCityLabel}
      </Button>
    </Box>
  );

  return (
    <Box
      component="nav"
      data-testid="desktop-navbar"
      className={clsx(BASE_CLASSES, TRANSITION_CLASSES, backgroundClasses)}
      aria-label="Main navigation"
    >
      <SectionContent additionalClassName="grid grid-cols-4 w-full items-center">
        {renderLogo()}
        {renderNavigationLinks()}
        {renderUserActions()}
      </SectionContent>
    </Box>
  );
};

export default DesktopNavBar;
