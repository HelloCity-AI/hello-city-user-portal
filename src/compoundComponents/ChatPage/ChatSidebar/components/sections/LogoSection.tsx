'use client';

import Image from 'next/image';
import { Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import ItemWrapper from '../layout/ItemWrapper';
import ResponsiveIconContainer from '../layout/ResponsiveIconContainer';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import CollapseToggleButton from '../ui/CollapseToggleButton';
import LanguageMenu from '@/compoundComponents/Menus/LanguageMenu';
import { useState, useEffect } from 'react';

interface LogoSectionProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

/**
 * Logo Section Component - Header area of the sidebar
 * Contains logo, application name, language switcher, and uses CollapseToggleButton
 * Expanded: Logo(32px) + Name(144px) + Language(32px) = 208px + floating collapse button
 * Collapsed: Logo(32px) + Name(0px) + Language(0px) = 32px + floating collapse button
 */
export default function LogoSection({ isCollapsed, onToggle }: LogoSectionProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogoClick = () => {
    router.push(`/${language}`);
  };
  return (
    <ItemWrapper variant="normal">
      <div className="relative flex h-12 items-center">
        {/* Clickable logo and name container */}
        <div
          onClick={isCollapsed ? onToggle : handleLogoClick}
          className="flex cursor-pointer items-center"
        >
          {/* Logo icon container - Fixed 32px width */}
          <div className="relative z-10 flex h-10 w-8 items-center justify-center rounded-lg bg-white">
            <Image
              src="/images/logo-chat-page.png"
              alt="HelloCity"
              width={24}
              height={24}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* Application name area - 144px -> 0px */}
          <ResponsiveContainer isCollapsed={isCollapsed} expandedWidthClass="w-[144px]">
            <Typography
              variant="h6"
              className="select-none whitespace-nowrap pl-3 text-lg font-bold text-gray-800"
            >
              HelloCity
            </Typography>
          </ResponsiveContainer>
        </div>

        {/* Language menu container - 32px -> 0px */}
        <ResponsiveIconContainer isCollapsed={isCollapsed} responsive>
          <LanguageMenu
            trigger={<LanguageIcon fontSize="small" />}
            layout={isMobile ? 'vertical' : 'horizontal'}
            textAlignCenter={true}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          />
        </ResponsiveIconContainer>

        {/* Collapse toggle button - Independent floating component */}
        <CollapseToggleButton isCollapsed={isCollapsed} onToggle={onToggle} />
      </div>
    </ItemWrapper>
  );
}
