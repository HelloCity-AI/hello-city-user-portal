'use client';

import React, { useState } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import useIsMobile from '@/hooks/useIsMobile';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';
import { type NavConfig } from './navConfig';

export interface NavBarProps {
  navConfig: NavConfig;
  hasSignedIn: boolean;
}

const NavBar = () => {
  // to be replaced when user slice is setup
  const [hasSignedIn, _setHasSignedIn] = useState<boolean>(false);
  const navConfig = useNavigation();
  const isMobile = useIsMobile();

  return isMobile ? (
    <MobileNavBar hasSignedIn={hasSignedIn} navConfig={navConfig} />
  ) : (
    <DesktopNavBar hasSignedIn={hasSignedIn} navConfig={navConfig} />
  );
};

export default NavBar;
