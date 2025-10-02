'use client';

import { useState } from 'react';
import DrawerContainer from './components/layout/DrawerContainer';
import LogoSection from './components/sections/LogoSection';
import ActionsSection from './components/sections/ActionsSection';
import HistorySection from './components/sections/HistorySection';
import UserSection from './components/sections/UserSection';
import { mockChatHistory, defaultActiveSessionId } from './mockChatHistory';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { useParams, useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

export interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: Date;
  isActive: boolean;
}

/**
 * Chat Sidebar - Uses precise 3-layer structure
 *
 * Features:
 * - Drawer: 8px padding, width auto
 * - ItemWrapper: width auto, driven by content
 * - Each Item: expanded 240px, collapsed 40px
 * - Icon container: fixed 40px, perfectly centered
 * - Responsive container: precise width and opacity control
 * - Self-contained: manages its own collapse state and data
 */
export default function ChatSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(mockChatHistory);
  const params = useParams();
  const router = useRouter();
  const { conversations, isLoading } = useSelector((state: RootState) => state.conversation);
  const userId = useSelector((state: RootState) => state.user.data?.userId);

  const handleNewChat = () => {
    router.push(`/${params.lang}/assistant`);
  };

  const handleSearch = () => {
    console.log('Search clicked');
  };

  const handleHistoryClick = (conversationId: string) => {
    router.push(`/${params.lang}/assistant/${conversationId}`);
  };

  return (
    <DrawerContainer>
      {/*Top Section - Logo section */}
      <LogoSection isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((prev) => !prev)} />

      {/* Main Actions - Action buttons section */}
      <div className="mt-2">
        <ActionsSection
          isCollapsed={isCollapsed}
          onNewChat={handleNewChat}
          onSearch={handleSearch}
        />
      </div>

      {/* History Section - Chat history section */}
      <div className="mt-8 flex-1 overflow-hidden">
        {!isCollapsed && (isLoading || userId === undefined) ? (
          <div className="flex h-full w-full items-center justify-center">
            <CircularProgress size={40} className="m-auto" />
          </div>
        ) : (
          <HistorySection
            isCollapsed={isCollapsed}
            chatHistory={chatHistory}
            onHistoryClick={handleHistoryClick}
            activeSessionId={defaultActiveSessionId}
            setChatHistory={setChatHistory}
            conversationsHistory={conversations}
          />
        )}
      </div>

      {/* Bottom Section - User section */}
      <UserSection isCollapsed={isCollapsed} />
    </DrawerContainer>
  );
}
