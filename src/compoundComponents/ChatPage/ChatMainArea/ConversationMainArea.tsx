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
import { useState, useEffect } from 'react';
import type { UIMessage } from 'ai';
import { DefaultChatTransport } from 'ai';
import { ConversationPromptInput } from './components/ui/ConversationPromptInput';
import ChatEmptyState from './components/ui/ChatEmptyState';
import { useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import MessageSkeleton from './components/ui/MessageSkeleton';
import { useChat } from '@ai-sdk/react';

interface ChatMainAreaProps {
  conversationId?: string;
  initialMessages?: UIMessage[];
  isLoadingMessages?: boolean;
}

const ChatMainArea = ({
  conversationId,
  initialMessages,
  isLoadingMessages = false,
}: ChatMainAreaProps) => {
  const [input, setInput] = useState('');
  const router = useRouter();
  const { language } = useLanguage();

  const { sendMessage, messages, status } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
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

  const isNewConversation = !conversationId;

  const conversations = useSelector((state: RootState) => state.conversation.conversations);

  useEffect(() => {
    if (!conversationId) return;

    const conversationExists = conversations.some((con) => con.conversationId === conversationId);

    if (!conversationExists && conversations.length > 0) {
      router.push(`/${language}/assistant`);
    }
  }, [conversationId, conversations, router, language]);

  const handleSubmit = (_message: PromptInputMessage, event: FormEvent) => {
    event.preventDefault();
    if (input.trim()) {
      const userMessage: UIMessage = {
        id: Date.now().toString() + '_user',
        role: 'user',
        parts: [{ type: 'text', text: input }],
      };

      sendMessage(userMessage);
      setInput('');
    }
  };

  return (
    <ChatMainContentContainer>
      {/* Messages Area - Direct Conversation component as flex-1 */}
      <Conversation>
        <ConversationContent>
          {isNewConversation ? (
            <ChatEmptyState />
          ) : isLoadingMessages ? (
            <MessageSkeleton />
          ) : (
            <>
              {messages.map((message: UIMessage) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  aiAvatarSrc={'/images/logo-avatar.png'}
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
      />
    </ChatMainContentContainer>
  );
};

export default ChatMainArea;
