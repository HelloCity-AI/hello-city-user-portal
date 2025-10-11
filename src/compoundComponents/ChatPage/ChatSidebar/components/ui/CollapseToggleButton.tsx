'use client';

import { IconButton } from '@mui/material';
import ResponsiveIconContainer from '../layout/ResponsiveIconContainer';
import { mergeClassNames } from '@/utils/classNames';

interface CollapseToggleButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Collapse Toggle Button Component
 * Provides a floating toggle button for sidebar collapse/expand functionality
 * Features complex positioning animation and dynamic SVG icon
 */
export default function CollapseToggleButton({
  isCollapsed,
  onToggle,
  className,
}: CollapseToggleButtonProps) {
  const iconButtonClassName = mergeClassNames(
    'w-8 h-8 text-gray-600',
    // Mobile: blue background only when collapsed, no background when expanded
    isCollapsed
      ? 'bg-blue-500/10 hover:bg-blue-500/20 md:bg-transparent md:hover:bg-black/5'
      : 'bg-transparent hover:bg-black/5',
  );

  return (
    <div
      className={mergeClassNames(
        'absolute z-10 h-10 w-8 rounded-lg hover:opacity-100',
        // Mobile: no background when collapsed, Desktop: white background
        isCollapsed ? 'bg-transparent md:bg-white' : 'bg-white',
        // Mobile: translate right by collapsed width when collapsed with 28px inset, Desktop: original behavior
        isCollapsed
          ? 'left-7 translate-x-[200px] opacity-100 md:left-0 md:translate-x-0 md:opacity-0'
          : 'left-[208px] translate-x-0 opacity-100',
        className,
      )}
      style={{
        transition: 'left 0.3s ease, transform 0.3s ease, opacity 0.1s ease',
        transitionDelay: isCollapsed ? '0s, 0s, 0.08s' : '0s, 0s, 0s',
      }}
    >
      <ResponsiveIconContainer>
        <IconButton
          size="small"
          onClick={onToggle}
          className={iconButtonClassName}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          disableRipple
          sx={{
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          <svg width="24" height="20" viewBox="0 0 16 16" fill="none">
            <rect
              x="3"
              y="3"
              width="10"
              height="10"
              rx="1"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <line
              x1={isCollapsed ? '6' : '10'}
              y1="5"
              x2={isCollapsed ? '6' : '10'}
              y2="11"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </IconButton>
      </ResponsiveIconContainer>
    </div>
  );
}
