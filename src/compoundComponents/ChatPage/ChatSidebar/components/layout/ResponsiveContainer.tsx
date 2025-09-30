'use client';

import type { ReactNode } from 'react';
import { mergeClassNames } from '@/utils/classNames';

interface ResponsiveContainerProps {
  children: ReactNode;
  isCollapsed: boolean;
  expandedWidthClass: string; // Expanded width class (e.g. 'w-40', 'w-50')
  centerContent?: boolean; // Whether to center content (default false)
  className?: string;
}

/**
 * Responsive Width Container Component
 *
 * Core functionality:
 * - Expanded: Shows content with specified Tailwind width class (w-40, w-[120px], w-[200px] etc.)
 * - Collapsed: Hides content completely (w-0, opacity-0)
 * - Smooth width and opacity transitions (300ms ease-out)
 *
 * Layout options:
 * - centerContent=false: Left-aligned content (for text with padding)
 * - centerContent=true: Centered content (for icons and buttons)
 *
 * Usage: Text containers, button containers in collapsible sidebars
 * Props: expandedWidthClass accepts any Tailwind width class or arbitrary values
 */
export default function ResponsiveContainer({
  children,
  isCollapsed,
  expandedWidthClass,
  centerContent = false,
  className,
}: ResponsiveContainerProps) {
  return (
    <div
      className={mergeClassNames(
        // Base layout
        'flex items-center overflow-hidden',
        centerContent ? 'justify-center' : 'justify-start',
        '[&>*]:min-w-0 [&>*]:shrink-0',
        // Width: expanded -> specific class, collapsed -> 0
        isCollapsed ? 'w-0' : expandedWidthClass,
        // Opacity: collapsed -> 0, expanded -> 100
        isCollapsed ? 'opacity-0' : 'opacity-100',
        'transition-[width,opacity] duration-300 ease-out',
        className,
      )}
    >
      {children}
    </div>
  );
}
