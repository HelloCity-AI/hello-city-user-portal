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
import { updateTaskStatus, removeTask } from '@/store/slices/conversation';
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
    // // 深度调试: 完整分析 message 结构
    // // 从 parts 中提取文本内容
    // const textContent = extendedMessage.parts
    //   ?.filter((p: any) => p.type === 'text')
    //   .map((p: any) => p.text)
    //   .join('') || '';

    // console.log('🔍 [MessageBubble] Full message debug:', {
    //   messageId: message.id,
    //   role: message.role,
    //   hasTextContent: textContent.length > 0,
    //   textContentLength: textContent.length,
    //   textContentPreview: textContent.substring(0, 100),
    //   hasParts: !!extendedMessage.parts,
    //   partsCount: extendedMessage.parts?.length,
    //   partsTypes: extendedMessage.parts?.map((p: any) => p.type),
    //   partsDetails: extendedMessage.parts?.map((p: any, i: number) => ({
    //     index: i,
    //     type: p.type,
    //     hasText: 'text' in p ? !!p.text : false,
    //     textLength: 'text' in p ? p.text?.length : 0,
    //     hasData: 'data' in p,
    //     dataKeys: 'data' in p ? Object.keys(p.data || {}) : [],
    //   })),
    //   rawParts: JSON.stringify(extendedMessage.parts, null, 2),
    // });

    const checklistParts = extendedMessage.parts.filter(isChecklistDataPart);
    // if (checklistParts.length > 0) {
    //   console.log('✅ [MessageBubble] Found checklist data parts:', checklistParts.length);
    // }

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
          console.log(
            `[MessageBubble] Skipping stale generating banner for completed checklist:`,
            checklistId,
          );
          return; // Skip this banner, keep the completed status in Redux
        }

        // Dispatch banner data to Redux
        dispatch(upsertChecklistMetadata(part.data));

        // Mark as processed to prevent re-processing
        processedBannersRef.current[messageId].add(checklistId);

        // Update task status if taskId exists
        const maybeTaskId =
          (part.data as { taskId?: string; _taskId?: string }).taskId ??
          (part.data as { taskId?: string; _taskId?: string })._taskId;
        if (maybeTaskId) {
          dispatch(updateTaskStatus({ taskId: maybeTaskId, status: 'generating' }));
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
              // console.log('🎨 [MessageBubble] Rendering ChecklistBannerMessage:', {
              //   partId: part.id,
              //   checklistId: part.data?.checklistId,
              //   status: part.data?.status,
              //   title: part.data?.title,
              //   index: index,
              // });
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
              // console.log('📋 [MessageBubble] Skipping checklist data part (not rendered):', {
              //   checklistId: part.data?.checklistId,
              //   itemsCount: part.data?.items?.length,
              // });
              return null;
            }

            switch (part.type) {
              case 'text': {
                const normalizedText = part.text?.replace(/\s|\u200b/gi, '') ?? '';
                if (!normalizedText.length) {
                  // console.log('⚪ [MessageBubble] Skipping empty text part at index:', index);
                  return null;
                }
                // console.log('💬 [MessageBubble] Rendering text part:', {
                //   index: index,
                //   length: part.text?.length,
                //   preview: part.text?.substring(0, 50),
                // });
                return <Response key={`${message.id}-${index}`}>{part.text}</Response>;
              }
              default:
                // console.log('❓ [MessageBubble] Unknown part type:', part.type, 'at index:', index);
                return null;
            }
          })
        )}
      </MessageContent>
    </Message>
  );
};

export default MessageBubble;
