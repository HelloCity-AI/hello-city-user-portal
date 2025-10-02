'use client';

import { Typography } from '@mui/material';
import { Trans } from '@lingui/react';
import HistoryItem from '../ui/HistoryItem';
import { mergeClassNames } from '@/utils/classNames';
import { TEXT_STYLES } from '../../constants';
import {
  type Conversation,
  updateConversation,
  deleteConversation,
} from '@/store/slices/conversation';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { RootState } from '@/store';

interface HistorySectionProps {
  isCollapsed: boolean;
  onHistoryClick: (sessionId: string) => void;
  conversationsHistory: Conversation[] | null;
}

/**
 * History Section - Manages chat history list
 * Contains HISTORY title and history items list
 */
export default function HistorySection({
  isCollapsed,
  onHistoryClick,
  conversationsHistory,
}: HistorySectionProps) {
  const [activeConversationId, setActiveConversationId] = useState<string | null>('');
  const dispatch = useDispatch();
  const params = useParams();
  const loadingConversationIds = useSelector(
    (state: RootState) => state.conversation.loadingConversationIds,
  );

  useEffect(() => {
    if (!params.conversationId?.[0]) return;
    setActiveConversationId(params?.conversationId[0]);
  }, [params.conversationId]);

  const handleDelete = (conversationId: string): void => {
    dispatch(deleteConversation(conversationId));
  };

  const handleRename = (conversationId: string, title: string): void => {
    dispatch(updateConversation({ id: conversationId, title }));
  };

  return (
    <>
      {/* HISTORY title area */}
      {!isCollapsed && (
        <Typography variant="caption" className={TEXT_STYLES.historyTitle}>
          <Trans id="sidebar.history.title" message="HISTORY" />
        </Typography>
      )}

      {/* History items list */}
      <div
        className={mergeClassNames(
          'mt-3 overflow-y-auto pb-4',
          isCollapsed ? 'max-h-none' : 'max-h-[calc(100vh-300px)]',
        )}
      >
        {conversationsHistory &&
          conversationsHistory.map((item) => (
            <HistoryItem
              key={item.conversationId}
              text={item.title}
              isCollapsed={isCollapsed}
              onClick={() => onHistoryClick(item.conversationId)}
              isActive={item.conversationId === activeConversationId}
              id={item.conversationId}
              onDelete={handleDelete}
              onRename={handleRename}
              isLoading={loadingConversationIds.includes(item.conversationId)}
            />
          ))}
      </div>
    </>
  );
}
