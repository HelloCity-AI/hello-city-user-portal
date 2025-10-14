'use client';

import type { ReactNode } from 'react';
import { mergeClassNames } from '@/utils/classNames';

interface DrawerContainerProps {
  children: ReactNode;
  className?: string;
  isCollapsed?: boolean;
}

/**
 * Main Drawer Container Component
 * Usage: Root container for collapsible sidebar content
 * Mobile: translates left when collapsed to hide sidebar, only toggle visible
 */
export default function DrawerContainer({
  children,
  className,
  isCollapsed,
}: DrawerContainerProps) {
  return (
    <aside
      className={mergeClassNames(
        'flex h-screen flex-col py-2',
        'bg-white/80 backdrop-blur-md',
        'border-r border-chat-ai-message-border',
        // Mobile: translate left + width 0 + no horizontal padding when collapsed
        isCollapsed
          ? 'w-0 -translate-x-[200px] px-0 md:w-auto md:translate-x-0 md:px-2'
          : 'w-auto translate-x-0 px-2',
        className,
      )}
      style={{
        transition: 'transform 0.3s ease-out, width 0.3s ease-out, padding 0.3s ease-out',
      }}
    >
      {children}
    </aside>
  );
}
