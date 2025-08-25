'use client';

import React, { useEffect, useState } from 'react';
import MobileNavBar from './MobileNavBar';
import DesktopNavBar from './DesktopNavBar';
import { useNavItems } from '@/hooks/useNavigation';
import { MOBILE_BREAKPOINT, type NavItem } from './navConfig';

export interface NavBarProps {
  className?: string;
  navItems: NavItem[];
  hasSignedIn: boolean;
}

export type { NavItem };

const NavBar = () => {
  // to be replaced when user slice is setup
  const [hasSignedIn, _setHasSignedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navItems = useNavItems();

  // check viewport width
  useEffect(() => {
    const mediaQueryList = window.matchMedia(MOBILE_BREAKPOINT);
    const handler = () => setIsMobile(!mediaQueryList.matches);
    handler();
    mediaQueryList.addEventListener('change', handler);
    return () => mediaQueryList.removeEventListener('change', handler);
  }, []);

  return isMobile ? (
    <MobileNavBar hasSignedIn={hasSignedIn} navItems={navItems} />
  ) : (
    <DesktopNavBar hasSignedIn={hasSignedIn} navItems={navItems} />
  );
};

export default NavBar;
