'use client';
import type { ReactNode } from 'react';

interface ChatMainContentContainerProps {
  children: ReactNode;
}

/**
 * Chat main area content container that provides standardized spacing
 * from sidebar, results panel, top, and bottom areas.
 * Handles responsive layout and overflow for chat conversation.
 */
export default function ChatMainContentContainer({ children }: ChatMainContentContainerProps) {
  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-1 overflow-hidden px-4 pb-6 pt-[52px] sm:px-6 md:px-8 lg:px-12 lg:py-8">
      {/* Add min-width to prevent content deformation on mobile */}
      <div className="relative flex min-w-[320px] flex-1 flex-col md:min-w-0">{children}</div>
    </div>
  );
}
