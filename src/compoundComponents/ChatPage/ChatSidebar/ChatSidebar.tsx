'use client';

import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DrawerContainer from './components/layout/DrawerContainer';
import LogoSection from './components/sections/LogoSection';
import ActionsSection from './components/sections/ActionsSection';
import HistorySection from './components/sections/HistorySection';
import UserSection from './components/sections/UserSection';
import { type RootState } from '@/store';
import SearchChatMenu from '@/compoundComponents/Menus/SearchChatMenu';

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

  const handleNewChat = () => {
    router.push(`/${params.lang}/assistant`);
  };

  const handleHistoryClick = (conversationId: string) => {
    router.push(`/${params.lang}/assistant/${conversationId}`);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return conversations.filter((conv) =>
      conv.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [conversations, searchQuery]);

  return (
    <DrawerContainer isCollapsed={isCollapsed}>
      <LogoSection isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((prev) => !prev)} />

      <div className="mt-2">
        <ActionsSection isCollapsed={isCollapsed} onNewChat={handleNewChat} />

        <SearchChatMenu
          trigger={
            <button
              className={`mt-1 flex items-center justify-center rounded-lg transition-all duration-300 ${
                isCollapsed
                  ? 'h-[40px] w-[40px]'
                  : 'h-[40px] w-[240px] bg-[#1976d2] text-white hover:bg-[#1565c0]'
              }`}
            >
              <SearchIcon />
              {!isCollapsed && <span className="ml-2 text-sm font-medium">Search Chat</span>}
            </button>
          }
          conversations={filteredConversations}
          onSearch={(value) => setSearchQuery(value)}
          onSelect={(id) => handleHistoryClick(id)}
        />
      </div>

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

      <UserSection isCollapsed={isCollapsed} />
    </DrawerContainer>
  );
}
