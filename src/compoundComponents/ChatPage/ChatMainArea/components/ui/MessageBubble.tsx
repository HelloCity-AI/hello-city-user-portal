'use client';

import type { HTMLAttributes } from 'react';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { UIMessage } from 'ai';
import type { RootState } from '@/store';
import { Message, MessageContent } from '@/components/ai-elements/Message';
import { Response } from '@/components/ai-elements/Response';
import { Avatar } from '@mui/material';
import AiThinkingIndicator from './AiThinkingIndicator';
import ChecklistBannerMessage from './ChecklistBannerMessage';
import { mergeClassNames } from '@/utils/classNames';
import UserAvatar from '@/compoundComponents/UserAvatar';
import {
  isChecklistDataPart,
  isChecklistBannerPart,
  type ExtendedUIMessage,
} from '@/types/ai-message';
import { addChecklist, upsertChecklistMetadata } from '@/store/slices/checklist';
import { updateTaskStatus, removeTask, addActiveTask } from '@/store/slices/conversation';
import type { ChecklistItem } from '@/types/checklist.types';

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
  const dispatch = useDispatch();
  // Subscribe to checklists for status checking (useRef prevents infinite loop)
  const checklists = useSelector((state: RootState) => state.checklist.checklists);

  // Track processed banners to prevent infinite loop during SSE streaming
  // Key: message ID, Value: Set of processed checklist IDs
  const processedBannersRef = useRef<Record<string, Set<string>>>({});

  // Auto-store checklist data to Redux when message contains checklist part
  useEffect(() => {
    const messageId = message.id;

    // Initialize tracking set for this message
    if (!processedBannersRef.current[messageId]) {
      processedBannersRef.current[messageId] = new Set();
    }

    const checklistParts = extendedMessage.parts.filter(isChecklistDataPart);

    checklistParts.forEach((part) => {
      const checklistId = part.data.checklistId;

      // ✅ CRITICAL FIX: Check if already processed to prevent infinite loop
      // When checklist completes (generating → completed), SSE sends data-checklist event
      // Without this check, repeated dispatch causes Redux update → re-render → infinite loop
      if (processedBannersRef.current[messageId].has(checklistId)) {
        return; // Already processed, skip to prevent duplicate dispatch
      }

      const items = (part.data as { items?: unknown[] }).items;
      const hasItems = Array.isArray(items) && items.length > 0;

      if (hasItems) {
        dispatch(addChecklist(part.data));

        // Mark as processed to prevent re-processing
        processedBannersRef.current[messageId].add(checklistId);

        const maybeTaskId =
          (part.data as { taskId?: string; _taskId?: string }).taskId ??
          (part.data as { taskId?: string; _taskId?: string })._taskId;
        if (maybeTaskId) {
          dispatch(updateTaskStatus({ taskId: maybeTaskId, status: 'completed' }));
          dispatch(removeTask(maybeTaskId));
        }
      } else {
        dispatch(
          upsertChecklistMetadata({
            ...part.data,
            items: (Array.isArray(items) ? items : []) as ChecklistItem[],
          }),
        );

        // Mark as processed to prevent re-processing
        processedBannersRef.current[messageId].add(checklistId);
      }
    });

    const bannerParts = extendedMessage.parts.filter(isChecklistBannerPart);

    bannerParts.forEach((part) => {
      // Only store generating banners from message history
      // Completed banners should be loaded from API to get correct cityCode
      if (part.data.status === 'generating') {
        const checklistId = part.data.checklistId;

        // ✅ CRITICAL FIX: Check if already processed to prevent infinite loop
        // During SSE streaming, useEffect may trigger multiple times for same banner
        // Without this check, repeated dispatch causes Redux update → re-render → infinite loop
        if (processedBannersRef.current[messageId].has(checklistId)) {
          return; // Already processed, skip to prevent duplicate dispatch
        }

        // Defensive check: Don't overwrite completed status with stale generating banner
        // This prevents race condition when user switches pages during generation:
        // 1. SSE closes, banner stays "generating" in DB
        // 2. Task completes, GlobalTaskPoller updates Redux to "completed"
        // 3. User switches back, loads stale "generating" banner from DB
        // 4. Without this check, stale banner would overwrite correct "completed" status
        const existingStatus = checklists[checklistId]?.status;
        if (existingStatus === 'completed') {
          return; // Skip this banner, keep the completed status in Redux
        }

        // Dispatch banner data to Redux
        dispatch(upsertChecklistMetadata(part.data));

        // Mark as processed to prevent re-processing
        processedBannersRef.current[messageId].add(checklistId);

        // Add task to activeTasks for GlobalTaskPoller to monitor
        // This is critical when page is refreshed - without this, the poller won't track the task
        const maybeTaskId =
          (part.data as { taskId?: string; _taskId?: string }).taskId ??
          (part.data as { taskId?: string; _taskId?: string })._taskId;
        if (maybeTaskId) {
          dispatch(
            addActiveTask({
              taskId: maybeTaskId,
              conversationId: part.data.conversationId,
              status: 'generating',
            }),
          );
        }
      }
    });
  }, [message.id, extendedMessage.parts, dispatch, checklists]);

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
                  key={part.id || `${message.id}-${index}`}
                  checklistId={part.data.checklistId}
                  initialData={part.data}
                  onBannerClick={onBannerClick}
                />
              );
            }

            if (isChecklistDataPart(part)) {
              return null;
            }

            switch (part.type) {
              case 'text': {
                const normalizedText = part.text?.replace(/\s|\u200b/gi, '') ?? '';
                if (!normalizedText.length) {
                  return null;
                }
                return <Response key={`${message.id}-${index}`}>{part.text}</Response>;
              }
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
