'use client';

import type { ReactNode } from 'react';
import { mergeClassNames } from '@/utils/classNames';

interface DrawerContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Main Drawer Container Component
 * Usage: Root container for collapsible sidebar content
 */
export default function DrawerContainer({ children, className }: DrawerContainerProps) {
  return (
    <aside
      className={mergeClassNames(
        'flex h-screen w-auto flex-col p-2',
        'bg-white/80 backdrop-blur-md',
        'border-r border-chat-ai-message-border',
        className,
      )}
    >
      {children}
    </aside>
  );
}
