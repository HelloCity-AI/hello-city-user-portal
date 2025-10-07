'use client';

import type { FormEvent } from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/Conversation';
import type { PromptInputMessage } from '@/components/ai-elements/PromptInput';
import ChatMainContentContainer from '../../../components/AppPageSections/ChatMainContentContainer';
import MessageBubble from './components/ui/MessageBubble';
import { useState, useEffect, useRef } from 'react';
import type { UIMessage, ChatStatus } from 'ai';
import { DefaultChatTransport } from 'ai';
import { ConversationPromptInput } from './components/ui/ConversationPromptInput';
import ChatEmptyState from './components/ui/ChatEmptyState';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '@/store';
import {
  addConversationOptimistic,
  cacheConversationMessages,
  setPendingMessage,
  clearPendingMessage,
  invalidateConversationCache,
} from '@/store/slices/conversation';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@ai-sdk/react';
import { fetchWithErrorHandling } from '@/utils/fetchHelpers';
import { type Conversation as ConversationInterface } from '@/store/slices/conversation';

interface ChatMainAreaProps {
  conversationId?: string;
  initialMessages?: UIMessage[];
  onBannerClick?: () => void;
}

const ChatMainArea = ({ conversationId, initialMessages, onBannerClick }: ChatMainAreaProps) => {
  const [input, setInput] = useState('');
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { language } = useLanguage();
  const prevStatusRef = useRef<ChatStatus>('ready');
  const hasSentPendingRef = useRef<Set<string>>(new Set());

  const { sendMessage, messages, status } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat-v2',
      prepareSendMessagesRequest: ({ id, messages }) => {
        return {
          body: {
            conversationId: id,
            messages: messages,
          },
        };
      },
    }),
  });

  const pendingMessages = useSelector((state: RootState) => state.conversation.pendingMessages);
  const isNewConversation = !conversationId;

  // Send pending message after conversation creation (ref prevents duplicate sends)
  useEffect(() => {
    if (conversationId) {
      const pendingMessage = pendingMessages[conversationId];

      if (pendingMessage && !hasSentPendingRef.current.has(conversationId)) {
        const userMessage: UIMessage = {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
          role: 'user',
          parts: [{ type: 'text', text: pendingMessage }],
        };

        hasSentPendingRef.current.add(conversationId);
        sendMessage(userMessage);
        dispatch(clearPendingMessage(conversationId));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Invalidate cache after message is sent (ensures fresh data on next load)
  useEffect(() => {
    if (prevStatusRef.current === 'streaming' && status === 'ready' && conversationId) {
      dispatch(invalidateConversationCache(conversationId));
    }
    prevStatusRef.current = status;
  }, [status, conversationId, dispatch]);

  const handleSubmit = async (_message: PromptInputMessage, event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    if (!conversationId) {
      setIsCreatingConversation(true);
      try {
        const response = await fetchWithErrorHandling<ConversationInterface>(
          '/api/conversation/create',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: 'New Conversation',
              firstMessage: input,
            }),
          },
        );

        if (response.ok && response.data) {
          const newId = response.data.conversationId;
          const generatedTitle = response.data.title;

          dispatch(setPendingMessage({ conversationId: newId, message: input }));
          dispatch(
            addConversationOptimistic({
              conversationId: newId,
              title: generatedTitle,
            }),
          );
          dispatch(cacheConversationMessages({ conversationId: newId, messages: [] }));

          router.push(`/${language}/assistant/${newId}`);
        } else {
          console.error('[Conversation] Failed to create conversation:', response.status);
        }
      } catch (error) {
        console.error('[Conversation] Error creating conversation:', error);
      } finally {
        setIsCreatingConversation(false);
      }
    } else {
      const userMessage: UIMessage = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        role: 'user',
        parts: [{ type: 'text', text: input }],
      };
      sendMessage(userMessage);
      setInput('');
    }
  };

  return (
    <ChatMainContentContainer>
      <Conversation>
        <ConversationContent>
          {isNewConversation ? (
            <ChatEmptyState />
          ) : (
            <>
              {messages.map((message: UIMessage) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  aiAvatarSrc={'/images/logo-avatar.png'}
                  onBannerClick={onBannerClick}
                />
              ))}
              {status === 'submitted' && (
                <MessageBubble
                  key="ai-thinking"
                  message={{
                    id: 'thinking',
                    role: 'assistant',
                    parts: [{ type: 'text', text: '' }],
                  }}
                  isAiThinking={true}
                  aiAvatarSrc={'/images/logo-avatar.png'}
                />
              )}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <ConversationPromptInput
        value={input}
        onValueChange={setInput}
        onSubmit={handleSubmit}
        isAIReplying={status === 'streaming'}
        isCreating={isCreatingConversation}
      />
    </ChatMainContentContainer>
  );
};

export default ChatMainArea;
