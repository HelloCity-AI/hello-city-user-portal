'use client';

import React from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import useIsMobile from '@/hooks/useIsMobile';
import DesktopNavBar from './DesktopNavBar';
import MobileNavBar from './MobileNavBar';
import { AuthState } from '@/store/slices/user';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { type NavConfig } from './navConfig';

export interface NavBarProps {
  navConfig: NavConfig;
  hasAuthenticated: boolean;
}

const NavBar = () => {
  const { authStatus } = useSelector((state: RootState) => state.user);
  const navConfig = useNavigation();
  const isMobile = useIsMobile();
  const hasAuthenticated = authStatus !== AuthState.Unauthenticated;

  return isMobile ? (
    <MobileNavBar hasAuthenticated={hasAuthenticated} navConfig={navConfig} />
  ) : (
    <DesktopNavBar hasAuthenticated={hasAuthenticated} navConfig={navConfig} />
  );
};

export default NavBar;
