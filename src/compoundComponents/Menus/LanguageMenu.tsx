'use client';

import React from 'react';
import Dropdown from '@/components/Dropdown';
import useLanguageMenu from '@/hooks/useLanguageMenu';

interface LanguageMenuProps {
  trigger: React.ReactNode; // anchorElContent for Dropdown
  layout?: 'vertical' | 'horizontal';
  textAlignCenter?: boolean;
  transformOrigin?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
  };
  anchorOrigin?: { horizontal: 'left' | 'center' | 'right'; vertical: 'top' | 'center' | 'bottom' };
}

/**
 * LanguageMenu
 * - Reusable language dropdown for header/sidebar/etc.
 * - Single source of truth via useLanguageMenu
 */
const LanguageMenu: React.FC<LanguageMenuProps> = ({
  trigger,
  layout = 'horizontal',
  textAlignCenter = true,
  transformOrigin,
  anchorOrigin,
}) => {
  const { languageOptionsForDropdown: options } = useLanguageMenu();

  return (
    <Dropdown
      anchorElContent={trigger}
      dropdownOptions={options}
      layout={layout}
      textAlignCenter={textAlignCenter}
      transformOrigin={transformOrigin}
      anchorOrigin={anchorOrigin}
      disableHover
    />
  );
};

export default LanguageMenu;
