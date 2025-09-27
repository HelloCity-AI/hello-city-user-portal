'use client';

import type { ReactNode } from 'react';
import { mergeClassNames } from '@/utils/classNames';

interface ResponsiveIconContainerProps {
  children: ReactNode;
  isCollapsed?: boolean;
  responsive?: boolean;
  className?: string;
}

/**
 * Responsive Icon Container: supports both fixed and responsive modes
 *
 * Fixed mode (responsive = false, default):
 * - Always maintains 40px x 40px size
 * - Used for button icons that need to always be visible
 *
 * Responsive mode (responsive = true):
 * - Expanded: 40px x 40px, fully visible
 * - Collapsed: 0px size, completely hidden
 * - Used for overflow icons that need to be hidden
 */
export default function ResponsiveIconContainer({
  children,
  isCollapsed = false,
  responsive = false,
  className,
}: ResponsiveIconContainerProps) {
  return (
    <div
      className={mergeClassNames(
        'flex h-10 min-h-10 items-center justify-center',
        '[&>*]:shrink-0',
        responsive && isCollapsed ? 'w-0 min-w-0 opacity-0' : 'w-10 min-w-10 opacity-100',
        responsive ? 'overflow-hidden' : 'overflow-visible',
        responsive && 'transition-all duration-300 ease-out',
        className,
      )}
    >
      {children}
    </div>
  );
}
