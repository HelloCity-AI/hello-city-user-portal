'use client';

import Box from '@mui/material/Box';
import ChatSidebar from '@/compoundComponents/ChatPage/ChatSidebar';
import SectionBackground from '@/components/AppPageSections/SectionBackground';
import {
  mockChatHistory,
  defaultActiveSessionId,
} from '@/compoundComponents/ChatPage/ChatSidebar/mockChatHistory';
import { useState } from 'react';
import type { ReactNode } from 'react';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <Box
      className="flex h-screen w-screen overflow-hidden"
      sx={{ contain: 'layout size', isolation: 'isolate' }}
    >
      <SectionBackground />
      {/* Main layout */}
      <Box className="relative z-10 flex h-full w-full">
        <ChatSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!isSidebarCollapsed)}
          chatHistory={mockChatHistory}
          activeSessionId={defaultActiveSessionId}
        />

        {/* Main content area - children will be rendered here */}
        <Box className="flex-1">{children}</Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
