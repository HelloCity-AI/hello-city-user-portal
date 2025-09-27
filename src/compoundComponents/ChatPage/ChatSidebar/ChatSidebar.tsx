'use client';

import DrawerContainer from './components/layout/DrawerContainer';
import LogoSection from './components/sections/LogoSection';
import ActionsSection from './components/sections/ActionsSection';
import HistorySection from './components/sections/HistorySection';
import UserSection from './components/sections/UserSection';

export interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: Date;
  isActive: boolean;
}

export interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  chatHistory?: ChatHistoryItem[];
  activeSessionId?: string;
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
 */
export default function ChatSidebar({
  isCollapsed,
  onToggle,
  chatHistory = [],
  activeSessionId,
}: ChatSidebarProps) {
  const handleNewChat = () => {
    console.log('New chat clicked');
  };

  const handleSearch = () => {
    console.log('Search clicked');
  };

  const handleHistoryClick = (sessionId: string) => {
    console.log('History item clicked:', sessionId);
  };

  return (
    <DrawerContainer>
      {/*Top Section - Logo section */}
      <LogoSection isCollapsed={isCollapsed} onToggle={onToggle} />

      {/* Main Actions - Action buttons section */}
      <div className="mt-2">
        <ActionsSection
          isCollapsed={isCollapsed}
          onNewChat={handleNewChat}
          onSearch={handleSearch}
        />
      </div>

      {/* History Section - Chat history section */}
      <div className="mt-4 flex-1 overflow-hidden">
        <HistorySection
          isCollapsed={isCollapsed}
          chatHistory={chatHistory}
          onHistoryClick={handleHistoryClick}
          activeSessionId={activeSessionId}
        />
      </div>

      {/* Bottom Section - User section */}
      <UserSection isCollapsed={isCollapsed} />
    </DrawerContainer>
  );
}
