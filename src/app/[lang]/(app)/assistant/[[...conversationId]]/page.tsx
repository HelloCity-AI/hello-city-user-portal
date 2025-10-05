'use client';

import { useState, useEffect } from 'react';
import ChatMainArea from '@/compoundComponents/ChatPage/ChatMainArea';
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

  const loadingConversationIds = useSelector(
    (state: RootState) => state.conversation.loadingConversationIds,
  );

  const isLoadingMessages = Boolean(
    conversationId && loadingConversationIds.includes(conversationId),
  );

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchConversationMessages(conversationId));
    }
  }, [conversationId, dispatch]);

  const initialMessages: UIMessage[] | undefined = cachedMessages?.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: [{ type: 'text', text: msg.content }],
  }));

  // 等待历史消息加载完成后再渲染 ChatMainArea
  // 确保 useChat 初始化时就有正确的 initialMessages
  const shouldRenderChat = !conversationId || initialMessages !== undefined;

  return (
    <div className="flex h-screen">
      {shouldRenderChat ? (
        <ChatMainArea
          key={conversationId || 'new'}
          conversationId={conversationId}
          initialMessages={initialMessages}
          isLoadingMessages={isLoadingMessages}
        />
      ) : (
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <MessageSkeleton />
          </div>
        </div>
      )}
      <ChecklistPanel
        isCollapsed={isChecklistPanelCollapsed}
        onToggle={() => setChecklistPanelCollapsed((prev) => !prev)}
      />
    </div>
  );
}
