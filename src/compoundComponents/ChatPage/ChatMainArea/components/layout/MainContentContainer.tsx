'use client';
import type { ReactNode } from 'react';

interface MainContentContainerProps {
  children: ReactNode;
}

/**
 * Chat main area content container that provides standardized spacing
 * from sidebar, results panel, top, and bottom areas.
 * Handles responsive layout and overflow for chat conversation.
 */
export default function MainContentContainer({ children }: MainContentContainerProps) {
  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-1 overflow-hidden px-4 py-6 sm:px-6 md:px-8 lg:px-12 lg:py-8">
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  );
}
