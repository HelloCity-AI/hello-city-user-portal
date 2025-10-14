'use client';

import React from 'react';
import Dropdown from '@/components/Dropdown';
import useUserMenu from '@/hooks/menus/useUserMenu';
import type { ReactNode } from 'react';

interface UserMenuProps {
  trigger: ReactNode; // anchorElContent
  showUserLabel?: boolean;
  layout?: 'vertical' | 'horizontal';
  textAlignCenter?: boolean;
  transformOrigin?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
  };
  anchorOrigin?: { horizontal: 'left' | 'center' | 'right'; vertical: 'top' | 'center' | 'bottom' };
  disableIconButton?: boolean;
  disableHover?: boolean;
  onMenuClick?: () => void; // Optional callback for sidebar auto-collapse on mobile
}

/**
 * UserMenu
 * - Uses existing Dropdown component
 * - Data from useUserMenu()
 * - Intercepts the logout option to show a confirm modal
 */
const UserMenu: React.FC<UserMenuProps> = ({
  trigger,
  showUserLabel = true,
  layout = 'vertical',
  textAlignCenter,
  transformOrigin,
  anchorOrigin,
  disableIconButton,
  disableHover,
  onMenuClick,
}) => {
  const { options, ModalNode } = useUserMenu(onMenuClick);

  return (
    <React.Fragment>
      <Dropdown
        anchorElContent={trigger}
        dropdownOptions={options}
        showUserLabel={showUserLabel}
        layout={layout}
        textAlignCenter={textAlignCenter}
        transformOrigin={transformOrigin}
        anchorOrigin={anchorOrigin}
        disableIconButton={disableIconButton}
        disableHover={disableHover}
      />
      {ModalNode}
    </React.Fragment>
  );
};

export default UserMenu;
