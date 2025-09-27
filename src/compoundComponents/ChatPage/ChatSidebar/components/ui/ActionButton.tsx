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
 * Expanded: Icon(40px) + Text(200px) = 240px
 * Collapsed: Icon(40px) + Text(0px) = 40px
 * Uses Tailwind CSS for styling with hover effects
 */
export default function ActionButton({ icon, text, isCollapsed, onClick }: ActionButtonProps) {
  return (
    <ItemWrapper variant="compact">
      <div
        onClick={onClick}
        className={`flex h-10 cursor-pointer items-center rounded-lg ${HOVER_EFFECTS.light}`}
      >
        {/* Icon container - fixed 40px, always visible */}
        <ResponsiveIconContainer>{icon}</ResponsiveIconContainer>

        {/* Text container - 200px -> 0px (responsive width) */}
        <ResponsiveContainer isCollapsed={isCollapsed} expandedWidthClass="w-[200px]">
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
