import React from 'react';
import { auth0 } from '@/lib/auth0';
import { getNavigationConfig } from '@/hooks/useNavigation';
import NavBarClient from './NavBarClient';

export interface NavBarProps {
  navConfig: any;
  hasAuthenticated: boolean;
}

const NavBar = async () => {
  // Server-side: Read session without API call
  const session = await auth0.getSession();
  const hasAuthenticated = !!session?.user;
  const navConfig = getNavigationConfig();

  return <NavBarClient hasAuthenticated={hasAuthenticated} navConfig={navConfig} />;
};

export default NavBar;
