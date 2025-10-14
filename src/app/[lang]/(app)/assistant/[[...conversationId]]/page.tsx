'use client';

import { useState, useEffect } from 'react';
import ChatMainArea from '@/compoundComponents/ChatPage/ChatMainArea';
import ChatMainContentContainer from '@/components/AppPageSections/ChatMainContentContainer';
import ChecklistPanel from '@/compoundComponents/ChatPage/ChecklistPanel';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversationMessages } from '@/store/slices/conversation';
import { type RootState } from '@/store';
import type { UIMessage } from 'ai';
import MessageSkeleton from '@/compoundComponents/ChatPage/ChatMainArea/components/ui/MessageSkeleton';

export default function ChatPage() {
  const [isChecklistPanelCollapsed, setChecklistPanelCollapsed] = useState(true);
  const params = useParams();
  const conversationId = params.conversationId?.[0];
  const dispatch = useDispatch();

  const cachedMessages = useSelector((state: RootState) =>
    conversationId ? state.conversation.messagesByConversation[conversationId] : undefined,
  );
  const loadingMessageConversationIds = useSelector(
    (state: RootState) => state.conversation.loadingMessageConversationIds,
  );
  const conversationTitle = useSelector((state: RootState) =>
    conversationId
      ? state.conversation.conversations.find((c) => c.conversationId === conversationId)?.title
      : undefined,
  );

  // Update browser tab title when conversation title changes
  useEffect(() => {
    if (conversationTitle) {
      document.title = conversationTitle;
    } else {
      document.title = 'HelloCity - AI Assistant';
    }
  }, [conversationTitle]);

  // Fetch messages (saga handles caching with 5-minute TTL)
  useEffect(() => {
    if (conversationId) {
      dispatch(fetchConversationMessages(conversationId));
    }
  }, [conversationId, dispatch]);

  const initialMessages: UIMessage[] | undefined = cachedMessages?.map((msg) => ({
    id: msg.id,
    role: msg.role,
    // Use msg.parts if available, fallback to content-only for backward compatibility
    parts: (msg.parts && msg.parts.length > 0
      ? msg.parts
      : [{ type: 'text' as const, text: msg.content }]) as UIMessage['parts'],
  }));

  // Only show skeleton when actively loading this conversation's messages
  const isLoadingMessages = conversationId
    ? loadingMessageConversationIds.includes(conversationId)
    : false;
  const shouldRenderChat = !isLoadingMessages;

  const handleOpenChecklist = () => {
    setChecklistPanelCollapsed(false);
  };

  return (
    <div className="flex h-screen">
      {shouldRenderChat ? (
        <ChatMainArea
          conversationId={conversationId}
          initialMessages={initialMessages}
          onBannerClick={handleOpenChecklist}
        />
      ) : (
        <ChatMainContentContainer>
          <div className="flex-1 overflow-y-auto">
            <MessageSkeleton />
          </div>
        </ChatMainContentContainer>
      )}
      <ChecklistPanel
        isCollapsed={isChecklistPanelCollapsed}
        onToggle={() => setChecklistPanelCollapsed((prev) => !prev)}
        conversationId={conversationId}
      />
    </div>
  );
}
