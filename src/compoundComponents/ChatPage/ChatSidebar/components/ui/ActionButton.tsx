'use client';

import type { ReactNode } from 'react';
import { Typography } from '@mui/material';
import ItemWrapper from '../layout/ItemWrapper';
import ResponsiveIconContainer from '../layout/ResponsiveIconContainer';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import { HOVER_EFFECTS, TEXT_STYLES } from '../../constants';

interface ActionButtonProps {
  icon: ReactNode;
  text: ReactNode;
  isCollapsed: boolean;
  onClick: () => void;
}

/**
 * Action Button Component (New Chat, Search, etc.)
 * Expanded: Icon(32px) + Text(208px) = 240px
 * Collapsed: Icon(32px) + Text(0px) = 32px
 * Uses Tailwind CSS for styling with hover effects
 */
export default function ActionButton({ icon, text, isCollapsed, onClick }: ActionButtonProps) {
  return (
    <ItemWrapper variant="compact">
      <div
        onClick={onClick}
        className={`flex h-10 cursor-pointer items-center rounded-lg ${HOVER_EFFECTS.light}`}
      >
        {/* Icon container - fixed 32px, always visible */}
        <ResponsiveIconContainer>{icon}</ResponsiveIconContainer>

        {/* Text container - 208px -> 0px (responsive width) */}
        <ResponsiveContainer isCollapsed={isCollapsed} expandedWidthClass="w-[208px]">
          <Typography
            variant="body2"
            className={`${TEXT_STYLES.sidebarText} font-medium text-primaryBlack`}
          >
            {text}
          </Typography>
        </ResponsiveContainer>
      </div>
    </ItemWrapper>
  );
}
