'use client';

import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { Button, IconButton } from '@mui/material';
import SectionContent from '../HomepageSections/SectionContent';
import HamburgerMenuIcon from './HamburgerMenuIcon';
import type { NavItem } from './NavBar';
import UserDrawer from './UserDrawer';
import { Trans } from '@lingui/react';
import Link from 'next/link';
import NavDrawer from './NavDrawer';

interface MobileNavBarProps {
  className?: string;
  navItems: NavItem[];
  hasSignedIn: boolean;
}

const MobileNavBar: React.FC<MobileNavBarProps> = ({ navItems, hasSignedIn }) => {
  const [openDrawer, setOpenDrawer] = useState<'userDrawer' | 'navDrawer' | null>(null);
  const [navDrawerMenu, setNavDrawerMenu] = useState<NavItem[][]>([]);
  const [navDrawerSubMenuIdx, setNavDrawerSubMenuIdx] = useState<number | null>(null);
  const isBurgerIconChanged: boolean = openDrawer !== null;
  const isUserDrawerOpen: boolean = openDrawer === 'userDrawer';
  const isNavDrawerOpen: boolean = openDrawer === 'navDrawer';

  useEffect(() => {
    const navDrawerMenu: NavItem[][] = [];
    const menu = navItems;
    navDrawerMenu.push(menu);
    if (navDrawerSubMenuIdx) {
      const subMenu = menu[navDrawerSubMenuIdx]?.childrenItem;
      if (subMenu) navDrawerMenu.push(subMenu);
    }
    setNavDrawerMenu(navDrawerMenu);
  }, [navDrawerSubMenuIdx, navItems]);

  const handleNavDrawer = () => {
    if (isBurgerIconChanged) {
      setNavDrawerSubMenuIdx(null);
      setOpenDrawer(null);
      return;
    }
    setOpenDrawer('navDrawer');
  };

  const handleUserDrawer = () => {
    if (!isUserDrawerOpen) {
      setNavDrawerSubMenuIdx(null);
      setOpenDrawer('userDrawer');
      return;
    }
    setNavDrawerSubMenuIdx(null);
    setOpenDrawer(null);
  };

  const closeDrawerMenu = () => {
    setNavDrawerSubMenuIdx(null);
    setOpenDrawer(null);
  };

  const renderLogoOrBack = () => (
    <Box
      data-section="logo-or-back"
      className="relative flex h-[40px] w-[100px] items-center sm:h-[50px] sm:w-[120px]"
    >
      <Box
        component="div"
        className="absolute inset-0 transition-opacity duration-150"
        sx={{
          opacity: navDrawerSubMenuIdx === null ? 100 : 0,
        }}
      >
        <Image src="/images/logo-dark.png" alt="HelloCity Logo" fill className="object-contain" />
      </Box>
      <Button
        variant="tertiary"
        onClick={() => setNavDrawerSubMenuIdx(null)}
        disableFocusRipple
        className="flex items-center font-semibold text-primary transition-opacity duration-150"
        sx={{
          opacity: navDrawerSubMenuIdx !== null ? 100 : 0,
        }}
      >
        <Trans id="NaveBar.Back" message="← Back" />
      </Button>
    </Box>
  );

  const renderAuthButton = () => {
    if (hasSignedIn) {
      return (
        <IconButton onClick={handleUserDrawer} aria-label="User menu">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              cursor: 'pointer',
            }}
            src="/images/banner-image.jpeg"
            alt="User Avatar"
          />
        </IconButton>
      );
    }

    return (
      <Button
        component={Link}
        href={'/auth/login'}
        variant="tertiary"
        className="mr-2 h-[32px] whitespace-nowrap rounded-full bg-primary font-semibold"
      >
        <Trans id="NaveBar.Sign In" message="Sign In" />
      </Button>
    );
  };

  const renderMobileUserActions = () => (
    <Box
      component="div"
      data-section="user-actions"
      className="-ml-2 flex items-center gap-0 sm:gap-2"
    >
      {renderAuthButton()}
      <HamburgerMenuIcon
        isOpen={isBurgerIconChanged}
        onClick={handleNavDrawer}
        size={16}
        className="rounded-full text-primaryBlack"
        aria-label={isBurgerIconChanged ? 'Close menu' : 'Open menu'}
      />
    </Box>
  );

  return (
    <Box
      component="nav"
      data-testid="mobile-navbar"
      className="fixed left-0 top-0 z-50 flex w-[100vw] items-center bg-white py-2"
      aria-label="Main navigation"
    >
      <SectionContent additionalClassName="flex w-full items-center justify-between">
        {renderLogoOrBack()}
        {renderMobileUserActions()}
      </SectionContent>
      {hasSignedIn && <UserDrawer open={isUserDrawerOpen} closeDrawer={closeDrawerMenu} />}
      <NavDrawer
        open={isNavDrawerOpen}
        closeDrawer={closeDrawerMenu}
        onClose={closeDrawerMenu}
        fullMenu={navDrawerMenu}
        setSubMenuIndex={setNavDrawerSubMenuIdx}
        subMenuIdx={navDrawerSubMenuIdx}
      />
    </Box>
  );
};

export default MobileNavBar;
