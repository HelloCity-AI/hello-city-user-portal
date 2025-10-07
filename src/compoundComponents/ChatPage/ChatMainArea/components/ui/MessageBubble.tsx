'use client';

import type { HTMLAttributes } from 'react';
import type { UIMessage } from 'ai';
import { Message, MessageContent } from '@/components/ai-elements/Message';
import { Response } from '@/components/ai-elements/Response';
import { Avatar } from '@mui/material';
import AiThinkingIndicator from './AiThinkingIndicator';
import ChecklistBannerMessage from './ChecklistBannerMessage';
import { mergeClassNames } from '@/utils/classNames';
import UserAvatar from '@/compoundComponents/UserAvatar';
import { isChecklistBannerPart, type ExtendedUIMessage } from '@/types/ai-message';

export interface MessageBubbleProps extends HTMLAttributes<HTMLDivElement> {
  message: UIMessage;
  aiAvatarSrc?: string;
  isAiThinking?: boolean;
  onBannerClick?: () => void;
}

const MessageBubble = ({
  message,
  className,
  aiAvatarSrc,
  isAiThinking = false,
  onBannerClick,
  ...props
}: MessageBubbleProps) => {
  const isUser = message.role === 'user';
  const extendedMessage = message as ExtendedUIMessage;

  return (
    <Message
      from={message.role}
      key={message.id}
      className={mergeClassNames(
        'group flex !items-start gap-3 py-4',
        isUser ? 'flex-row-reverse justify-start break-all' : 'flex-row justify-start',
        className,
      )}
      {...props}
    >
      {message.role === 'user' ? (
        <UserAvatar size="2.25rem" clickable={false} />
      ) : (
        <Avatar
          src={aiAvatarSrc}
          className={mergeClassNames(
            'h-9 w-9 flex-shrink-0',
            aiAvatarSrc && 'overflow-hidden',
            !aiAvatarSrc && 'border border-chat-ai-message-border bg-chat-ai-message',
            'text-sm font-semibold text-chat-ai-message',
          )}
          sx={
            aiAvatarSrc
              ? {
                  '& img': {
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '85%',
                    height: '85%',
                  },
                }
              : {}
          }
        >
          AI
        </Avatar>
      )}

      <MessageContent
        variant="flat"
        className={mergeClassNames(
          isUser
            ? 'rounded-lg bg-chat-user-message text-primaryBlack'
            : 'max-w-[85%] rounded-lg py-3 pl-0 pr-4',
        )}
      >
        {isAiThinking && !isUser ? (
          <AiThinkingIndicator variant="compact" size="small" />
        ) : (
          extendedMessage.parts.map((part, index) => {
            if (isChecklistBannerPart(part)) {
              return (
                <ChecklistBannerMessage
                  key={`${message.id}-${index}`}
                  banner={part.banner}
                  onBannerClick={onBannerClick}
                />
              );
            }

            switch (part.type) {
              case 'text':
                return <Response key={`${message.id}-${index}`}>{part.text}</Response>;
              default:
                return null;
            }
          })
        )}
      </MessageContent>
    </Message>
  );
};

export default MessageBubble;
