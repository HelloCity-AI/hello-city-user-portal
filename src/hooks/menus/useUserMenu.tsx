'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import useLogoutConfirm from '@/hooks/modals/useLogoutConfirm';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Logout from '@mui/icons-material/Logout';
import { Trans } from '@lingui/react';

/**
 * useUserMenu
 * - Single hook to provide user menu actions (Profile, Logout, etc.)
 * - Integrates logout confirm modal internally.
 * - Designed for NavBar, drawers, and other placements.
 * @param onMenuClick - Optional callback executed after menu item click (e.g., auto-collapse sidebar on mobile)
 */
const useUserMenu = (onMenuClick?: () => void) => {
  const router = useRouter();
  const { language } = useLanguage();
  const { show: showLogoutConfirm, ModalNode } = useLogoutConfirm();

  const goProfile = () => {
    router.push(`/${language}/profile`);
    onMenuClick?.(); // Call optional callback after navigation
  };

  const options = [
    {
      id: 'profile',
      label: <Trans id="Profile" message="Profile" />,
      value: 'profile',
      icon: PersonOutlineIcon,
      divider: false,
      onClick: () => goProfile(),
    },
    {
      id: 'logout',
      label: <Trans id="Logout" message="Logout" />,
      value: 'logout',
      icon: Logout,
      divider: false,
      onClick: () => {
        showLogoutConfirm();
        onMenuClick?.(); // Call optional callback after showing logout modal
      },
    },
  ];

  return { options, ModalNode };
};

export default useUserMenu;
