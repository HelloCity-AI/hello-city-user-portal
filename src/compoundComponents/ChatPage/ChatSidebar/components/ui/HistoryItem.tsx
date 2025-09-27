'use client';

import { Typography, IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ItemWrapper from '../layout/ItemWrapper';
import ResponsiveIconContainer from '../layout/ResponsiveIconContainer';
import ResponsiveContainer from '../layout/ResponsiveContainer';
import { mergeClassNames } from '@/utils/classNames';
import { HOVER_EFFECTS, TEXT_STYLES, ICON_STYLES } from '../../constants';

interface HistoryItemProps {
  text: string;
  isCollapsed: boolean;
  onClick?: () => void;
  isActive?: boolean;
}

/**
 * History Item Component (Individual History Entry)
 * Expanded: Text(200px) + ResponsiveIconContainer(40px) = 240px
 * Collapsed: Text(0px) + ResponsiveIconContainer(0px) = 0px (completely hidden)
 * Uses Tailwind CSS for styling with responsive width transitions
 */
export default function HistoryItem({
  text,
  isCollapsed,
  onClick,
  isActive = false,
}: HistoryItemProps) {
  return (
    <ItemWrapper variant="compact">
      <div
        onClick={onClick}
        className={mergeClassNames(
          'flex h-10 items-center overflow-hidden rounded-lg transition-[width] duration-300 ease-out',
          isCollapsed ? 'w-0' : 'w-auto',
          isActive && !isCollapsed ? 'bg-blue-500/10' : 'bg-transparent',
          onClick ? 'cursor-pointer' : 'cursor-default',
          onClick && isActive && HOVER_EFFECTS.blue,
          onClick && !isActive && HOVER_EFFECTS.light,
        )}
      >
        {/* History text container - 200px -> 0px (responsive width) */}
        <ResponsiveContainer isCollapsed={isCollapsed} expandedWidthClass="w-[200px]">
          <Typography
            variant="body2"
            className={mergeClassNames(
              TEXT_STYLES.sidebarText,
              'overflow-hidden truncate',
              isActive ? 'font-medium text-primary-color' : 'font-normal text-primaryBlack',
            )}
          >
            {text}
          </Typography>
        </ResponsiveContainer>

        {/* More options icon - ResponsiveIconContainer provides responsive container, IconButton handles interaction */}
        <ResponsiveIconContainer isCollapsed={isCollapsed} responsive>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering history item click
              // TODO: Implement more options functionality
            }}
            className={`${ICON_STYLES.button} text-gray-500 ${HOVER_EFFECTS.transparent}`}
            aria-label="More options"
          >
            <MoreHorizIcon className={ICON_STYLES.small} />
          </IconButton>
        </ResponsiveIconContainer>
      </div>
    </ItemWrapper>
  );
}
