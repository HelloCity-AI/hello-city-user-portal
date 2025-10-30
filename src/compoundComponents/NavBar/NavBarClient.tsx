'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';
import { type NavConfig } from './navConfig';

interface NavBarClientProps {
  hasAuthenticated: boolean;
  navConfig: NavConfig;
}

const NavBarClient = ({ hasAuthenticated, navConfig }: NavBarClientProps) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileNavBar hasAuthenticated={hasAuthenticated} navConfig={navConfig} />
  ) : (
    <DesktopNavBar hasAuthenticated={hasAuthenticated} navConfig={navConfig} />
  );
};

export default NavBarClient;
