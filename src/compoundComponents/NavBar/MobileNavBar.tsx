'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Trans } from '@lingui/react';
import SectionContent from '@/components/HomepageSections/SectionContent';
import HamburgerMenuIcon from './HamburgerMenuIcon';
import NavDrawer from './NavDrawer';
import UserDrawer from './UserDrawer';
import UserAvatar from '@/compoundComponents/UserAvatar';
import useUserMenu from '@/hooks/menus/useUserMenu';
import type { NavBarProps } from './NavBar';
import type { NavItem } from './navConfig';
import useLanguageMenu from '@/hooks/menus/useLanguageMenu';

const MobileNavBar: React.FC<NavBarProps> = ({ navConfig, hasAuthenticated }) => {
  const [openDrawer, setOpenDrawer] = useState<'userDrawer' | 'navDrawer' | null>(null);
  // Derive menuStack from inputs to avoid setState in effects
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState<number | null>(null);
  const isBurgerIconChanged: boolean = openDrawer !== null;
  const isUserDrawerOpen: boolean = openDrawer === 'userDrawer';
  const isNavDrawerOpen: boolean = openDrawer === 'navDrawer';
  const { logo, navItems } = navConfig;
  const { options: userMenuOptions, ModalNode } = useUserMenu();
  const { languageOptionsForDrawer } = useLanguageMenu();

  // Build menu stack directly; the dataset is small and recomputation is cheap.
  const languageRoot: NavItem = {
    id: 'change language',
    href: '',
    label: <Trans id="NavBar.ChangeLanguage" message="Change Language" />,
    childrenItem: languageOptionsForDrawer,
  };
  const rootMenu: NavItem[] = [...navItems, languageRoot];
  const menuStack: NavItem[][] = [rootMenu];
  if (activeSubMenuIndex !== null) {
    const activeItem = rootMenu[activeSubMenuIndex];
    if (activeItem?.childrenItem) {
      menuStack.push(activeItem.childrenItem);
    }
  }

  const handleNavDrawer = () => {
    if (isBurgerIconChanged) {
      setActiveSubMenuIndex(null);
      setOpenDrawer(null);
      return;
    }
    setOpenDrawer('navDrawer');
  };

  const handleUserDrawer = () => {
    if (!isUserDrawerOpen) {
      setActiveSubMenuIndex(null);
      setOpenDrawer('userDrawer');
      return;
    }
    setActiveSubMenuIndex(null);
    setOpenDrawer(null);
  };

  const closeDrawerMenu = () => {
    setActiveSubMenuIndex(null);
    setOpenDrawer(null);
  };

  const renderLogoOrBack = () => (
    <Box
      data-section="logo-or-back"
      className="relative flex h-[40px] w-[120px] items-center sm:h-[50px] sm:w-[150px]"
    >
      <Box
        component="div"
        className="absolute inset-0 transition-opacity duration-150"
        sx={{ opacity: activeSubMenuIndex === null ? 100 : 0 }}
      >
        <Link href={logo.href} className="relative block h-full w-full">
          <Image
            src={logo.dark}
            alt="HelloCity Logo"
            fill
            className="object-contain"
            sizes="150px"
          />
        </Link>
      </Box>
      <Button
        variant="tertiary"
        onClick={() => setActiveSubMenuIndex(null)}
        disableFocusRipple
        className="flex items-center font-semibold text-primary transition-opacity duration-150"
        sx={{ opacity: activeSubMenuIndex !== null ? 100 : 0 }}
      >
        <Trans id="NavBar.Back" message="← Back" />
      </Button>
    </Box>
  );

  const renderAuthButton = () => {
    if (hasAuthenticated) {
      return (
        <IconButton onClick={handleUserDrawer} aria-label="User menu">
          <UserAvatar size="2rem" />
        </IconButton>
      );
    }

    return (
      <Button
        onClick={() => {
          window.location.href = '/auth/login';
        }}
        variant="tertiary"
        className="mr-2 h-[32px] whitespace-nowrap rounded-full bg-primary font-semibold"
      >
        <Trans id="NavBar.Sign In" message="Sign In" />
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
      {hasAuthenticated && (
        <UserDrawer
          open={isUserDrawerOpen}
          closeDrawer={closeDrawerMenu}
          options={userMenuOptions}
        />
      )}
      <NavDrawer
        open={isNavDrawerOpen}
        closeDrawer={closeDrawerMenu}
        onClose={closeDrawerMenu}
        menuStack={menuStack}
        setActiveSubMenuIndex={setActiveSubMenuIndex}
        activeSubMenuIndex={activeSubMenuIndex}
      />
      {ModalNode}
    </Box>
  );
};

export default MobileNavBar;
