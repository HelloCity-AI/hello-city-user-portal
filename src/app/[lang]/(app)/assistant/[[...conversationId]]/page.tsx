'use client';

import { useState, useEffect, useRef } from 'react';
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
  const hasFetchedRef = useRef<Set<string>>(new Set());

  const cachedMessages = useSelector((state: RootState) =>
    conversationId ? state.conversation.messagesByConversation[conversationId] : undefined,
  );
  const conversations = useSelector((state: RootState) => state.conversation.conversations);
  const isLoadingList = useSelector((state: RootState) => state.conversation.isLoading);

  // Fetch messages (saga checks cache first, ref prevents duplicate dispatches)
  useEffect(() => {
    if (conversationId && !hasFetchedRef.current.has(conversationId)) {
      hasFetchedRef.current.add(conversationId);
      dispatch(fetchConversationMessages(conversationId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const initialMessages: UIMessage[] | undefined = cachedMessages?.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: [{ type: 'text', text: msg.content }],
  }));

  const shouldRenderChat = (() => {
    if (!conversationId) return true;
    if (initialMessages !== undefined) return true;
    if (isLoadingList) return false;

    const conversationExists = conversations.some((c) => c.conversationId === conversationId);
    if (!conversationExists) return true;

    return false;
  })();

  return (
    <div className="flex h-screen">
      {shouldRenderChat ? (
        <ChatMainArea conversationId={conversationId} initialMessages={initialMessages} />
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
      />
    </div>
  );
}
