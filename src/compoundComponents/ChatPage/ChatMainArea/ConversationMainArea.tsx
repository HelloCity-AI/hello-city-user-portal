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
import { useState, useCallback, useEffect } from 'react';
import type { UIMessage } from 'ai';
import { ConversationPromptInput } from './components/ui/ConversationPromptInput';
import ChatEmptyState from './components/ui/ChatEmptyState';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import { fetchConversationMessages } from '@/store/slices/conversation';

// 假的AI回复消息列表
const fakeAIReplies = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  "That's an interesting question. Let me think about that...",
  "I understand what you're asking. Here's my perspective:",
  "Thanks for sharing that! I'd be happy to help you with this.",
  "That's a great point. Have you considered this approach?",
  "I appreciate you asking. From my experience, I'd suggest:",
  "That's something I can definitely help with. Here's what I recommend:",
  'Interesting! That reminds me of a similar situation where:',
  'Good question! Let me break this down for you:',
  "I see what you're getting at. Here's how I would approach it:",
];

interface ChatMainAreaProps {
  conversationId?: string;
}

const ChatMainArea = ({ conversationId }: ChatMainAreaProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isAIReplying, setIsAIReplying] = useState(false);
  const dispatch = useDispatch();

  const isNewConversation = !conversationId;

  const cachedMessages = useSelector((state: RootState) =>
    conversationId ? state.conversation.messagesByConversation[conversationId] : undefined,
  );

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchConversationMessages(conversationId));
    }
  }, [conversationId, dispatch]);

  useEffect(() => {
    if (cachedMessages) {
      const uiMessages: UIMessage[] = cachedMessages.map((msg) => {
        return {
          id: msg.id,
          role: msg.role,
          parts: [{ type: 'text', text: msg.content }],
        };
      });
      setMessages(uiMessages);
    }
  }, [cachedMessages]);

  // 假的AI回复函数
  const simulateAIReply = useCallback(() => {
    setIsAIReplying(true);

    // 模拟AI思考时间 (3-6秒随机)
    const replyDelay = Math.random() * 3000 + 3000;

    setTimeout(() => {
      const randomReply = fakeAIReplies[Math.floor(Math.random() * fakeAIReplies.length)];

      const aiMessage: UIMessage = {
        id: Date.now().toString() + '_ai',
        role: 'assistant',
        parts: [{ type: 'text', text: randomReply }],
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsAIReplying(false);
    }, replyDelay);
  }, []);

  const handleSubmit = (_message: PromptInputMessage, event: FormEvent) => {
    event.preventDefault();
    if (input.trim() && !isAIReplying) {
      // 添加用户消息
      const userMessage: UIMessage = {
        id: Date.now().toString() + '_user',
        role: 'user',
        parts: [{ type: 'text', text: input }],
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      // 触发AI回复
      simulateAIReply();
    }
  };

  return (
    <ChatMainContentContainer>
      {/* Messages Area - Direct Conversation component as flex-1 */}
      <Conversation>
        <ConversationContent>
          {isNewConversation ? (
            <ChatEmptyState />
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  aiAvatarSrc={'/images/logo-avatar.png'}
                />
              ))}
              {isAIReplying && (
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
        isAIReplying={isAIReplying}
      />
    </ChatMainContentContainer>
  );
};

export default ChatMainArea;
