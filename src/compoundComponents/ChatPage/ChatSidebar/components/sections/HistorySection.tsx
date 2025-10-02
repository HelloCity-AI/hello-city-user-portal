'use client';

import { Typography } from '@mui/material';
import { Trans } from '@lingui/react';
import HistoryItem from '../ui/HistoryItem';
import { mergeClassNames } from '@/utils/classNames';
import { TEXT_STYLES } from '../../constants';
import type { ChatHistoryItem } from '../../ChatSidebar';
import { type Conversation } from '@/store/slices/conversation';

interface HistorySectionProps {
  isCollapsed: boolean;
  chatHistory: ChatHistoryItem[];
  onHistoryClick: (sessionId: string) => void;
  activeSessionId?: string;
  setChatHistory: (chatHistory: ChatHistoryItem[]) => void;
  conversationsHistory: Conversation[] | null;
}

/**
 * History Section - Manages chat history list
 * Contains HISTORY title and history items list
 */
export default function HistorySection({
  isCollapsed,
  chatHistory,
  onHistoryClick,
  activeSessionId,
  setChatHistory,
  conversationsHistory,
}: HistorySectionProps) {
  const handleDelete = (conversationId: string) => {
    // TODO update with saga, will not handle logic in this component later
    const updatedChatHistory = chatHistory.filter((item) => item.id !== conversationId);
    setChatHistory(updatedChatHistory);
  };

  const handleRename = (conversationId: string, updatedTitle: string) => {
    // TODO update with saga, will not handle logic in this component later
    const updatedChatHistory = chatHistory.map((item) =>
      item.id === conversationId ? { ...item, title: updatedTitle } : item,
    );
    setChatHistory(updatedChatHistory);
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
              isActive={item.conversationId === activeSessionId}
              id={item.conversationId}
              onDelete={handleDelete}
              onRename={handleRename}
            />
          ))}
      </div>
    </>
  );
}
