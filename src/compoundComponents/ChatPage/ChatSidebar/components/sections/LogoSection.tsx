'use client';

import Image from 'next/image';
import { IconButton, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import ItemWrapper from '../layout/ItemWrapper';
import ResponsiveIconContainer from '../layout/ResponsiveIconContainer';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import CollapseToggleButton from '../ui/CollapseToggleButton';

interface LogoSectionProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLanguageSwitch: () => void;
}

/**
 * Logo Section Component - Header area of the sidebar
 * Contains logo, application name, language switcher, and uses CollapseToggleButton
 * Expanded: Logo(40px) + Name(120px) + Language(40px) = 200px + floating collapse button
 * Collapsed: Logo(40px) + Name(0px) + Language(0px) = 40px + floating collapse button
 */
export default function LogoSection({ isCollapsed, onToggle, onLanguageSwitch }: LogoSectionProps) {
  const router = useRouter();
  const { language } = useLanguage();

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
          {/* Logo icon container - Fixed 40px width */}
          <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <Image
              src="/images/logo-chat-page.png"
              alt="HelloCity"
              width={24}
              height={24}
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* Application name area - 120px -> 0px */}
          <ResponsiveContainer isCollapsed={isCollapsed} expandedWidthClass="w-[120px]">
            <Typography
              variant="h6"
              className="select-none whitespace-nowrap pl-3 text-lg font-bold text-gray-800"
            >
              HelloCity
            </Typography>
          </ResponsiveContainer>
        </div>

        {/* Language button container - 40px -> 0px */}
        <ResponsiveIconContainer isCollapsed={isCollapsed} responsive>
          <IconButton
            size="small"
            onClick={onLanguageSwitch}
            className="h-8 w-8 text-gray-600 hover:bg-black/5"
          >
            <LanguageIcon fontSize="small" />
          </IconButton>
        </ResponsiveIconContainer>

        {/* Collapse toggle button - Independent floating component */}
        <CollapseToggleButton isCollapsed={isCollapsed} onToggle={onToggle} />
      </div>
    </ItemWrapper>
  );
}
