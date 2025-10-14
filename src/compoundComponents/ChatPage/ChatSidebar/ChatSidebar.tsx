'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import DrawerContainer from './components/layout/DrawerContainer';
import LogoSection from './components/sections/LogoSection';
import ActionsSection from './components/sections/ActionsSection';
import HistorySection from './components/sections/HistorySection';
import UserSection from './components/sections/UserSection';
import { type RootState } from '@/store';

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
  const params = useParams();
  const router = useRouter();
  const { conversations, isLoading: isConversationsLoading } = useSelector(
    (state: RootState) => state.conversation,
  );

  const autoCollapseSidebarOnMobile = () => {
    // Auto-collapse sidebar on mobile after clicking any item
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  const handleNewChat = () => {
    router.push(`/${params.lang}/assistant`);
    autoCollapseSidebarOnMobile();
  };

  const handleSearch = () => {
    console.log('Search clicked');
    autoCollapseSidebarOnMobile();
  };

  const handleHistoryClick = (conversationId: string) => {
    router.push(`/${params.lang}/assistant/${conversationId}`);
    autoCollapseSidebarOnMobile();
  };

  return (
    <DrawerContainer isCollapsed={isCollapsed}>
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
        {!isCollapsed && isConversationsLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <CircularProgress size={40} className="m-auto" />
          </div>
        ) : (
          <HistorySection
            isCollapsed={isCollapsed}
            onHistoryClick={handleHistoryClick}
            conversationsHistory={conversations}
          />
        )}
      </div>
      {/* Bottom Section - User section */}
      <UserSection isCollapsed={isCollapsed} onMenuClick={autoCollapseSidebarOnMobile} />
    </DrawerContainer>
  );
}
