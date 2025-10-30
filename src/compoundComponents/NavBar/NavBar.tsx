'use client';

import React from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import useIsMobile from '@/hooks/useIsMobile';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';
import { useUser } from '@auth0/nextjs-auth0/client';
import { type NavConfig } from './navConfig';

export interface NavBarProps {
  navConfig: NavConfig;
  hasAuthenticated: boolean;
}

const NavBar = () => {
  const { user } = useUser();
  const navConfig = useNavigation();
  const isMobile = useIsMobile();
  const hasAuthenticated = !!user;

  return isMobile ? (
    <MobileNavBar hasAuthenticated={hasAuthenticated} navConfig={navConfig} />
  ) : (
    <DesktopNavBar hasAuthenticated={hasAuthenticated} navConfig={navConfig} />
  );
};

export default NavBar;
