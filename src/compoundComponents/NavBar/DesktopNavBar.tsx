'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import { Trans } from '@lingui/react';
import { twMerge } from 'tailwind-merge';
import { useTryHelloCity } from '@/hooks/useTryHelloCity';
import UserAvatar from '@/compoundComponents/UserAvatar';
import LanguageMenu from '@/compoundComponents/Menus/LanguageMenu';
import SectionContent from '@/components/HomepageSections/SectionContent';
import type { NavBarProps } from './NavBar';
import UserMenu from '@/compoundComponents/Menus/UserMenu';

const SCROLL_THRESHOLD = 20;
const BASE_CLASSES = 'fixed left-0 top-0 z-50 w-[100vw] flex items-center py-2';
const TRANSITION_CLASSES = 'transition-all duration-300 ease-in-out';

const DesktopNavBar: React.FC<NavBarProps> = ({ hasAuthenticated, navConfig }) => {
  const [hasBgColor, setHasBgColor] = useState<boolean>(false);
  const { href: tryHelloCityHref, label: tryHelloCityLabel } = useTryHelloCity();
  const scrollYRef = useRef(0);
  const { currentLanguage, logo, navItems } = navConfig;
  const backgroundClasses = hasBgColor ? 'bg-white shadow-md' : 'bg-transparent shadow-none';
  const EXCLUDED_NAV_ITEMS = ['change language'];
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const checkScrollPosition = () => {
      scrollYRef.current = window.scrollY;
      const shouldHaveBackground = scrollYRef.current > SCROLL_THRESHOLD;
      if (shouldHaveBackground !== hasBgColor) {
        setHasBgColor(shouldHaveBackground);
      }
    };

    checkScrollPosition();

    const handleScroll = () => {
      if (timer) return;
      timer = setTimeout(() => {
        checkScrollPosition();
        timer = null;
      }, 16);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timer) clearTimeout(timer);
    };
  }, [hasBgColor]);

  // Language options now come from a single hook via <LanguageMenu />

  const renderLogo = () => (
    <Box component="div" data-section="logo" className="relative h-[50px] w-[150px]">
      <Link href={logo.href} className="relative block h-full w-full">
        <Image
          src={hasBgColor ? logo.dark : logo.light}
          alt="HelloCity Logo"
          fill
          className="object-contain"
          sizes="150px"
          priority
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
        if (EXCLUDED_NAV_ITEMS.includes(navItem.id)) return;
        return (
          <Button
            component={Link}
            key={navItem.id}
            href={navItem.href || ''}
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
    if (hasAuthenticated) {
      return (
        <UserMenu trigger={<UserAvatar size="2.5rem" role="button" aria-label="User menu" />} />
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
        <Trans id="NavBar.Sign In" comment="Sign In button label" message="Sign In" />
      </Button>
    );
  };

  const renderUserActions = () => (
    <Box
      component="div"
      data-section="user-actions"
      className="flex items-center justify-end gap-3"
    >
      <LanguageMenu
        trigger={
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
            {currentLanguage.shortLabel}
          </Button>
        }
        layout="horizontal"
        textAlignCenter
        disableHover
      />
      {renderAuthSection()}
      <Button
        component={Link}
        href={tryHelloCityHref}
        variant="primary"
        className="min-w-fit flex-shrink-0 whitespace-nowrap font-semibold"
      >
        {tryHelloCityLabel}
      </Button>
    </Box>
  );

  return (
    <Box
      component="nav"
      data-testid="desktop-navbar"
      className={twMerge(BASE_CLASSES, TRANSITION_CLASSES, backgroundClasses)}
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
