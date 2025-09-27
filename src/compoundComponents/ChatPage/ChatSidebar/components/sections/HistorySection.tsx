'use client';

import { Typography } from '@mui/material';
import { Trans } from '@lingui/react';
import HistoryItem from '../ui/HistoryItem';
import { mergeClassNames } from '@/utils/classNames';
import { TEXT_STYLES } from '../../constants';

interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: Date;
  isActive: boolean;
}

interface HistorySectionProps {
  isCollapsed: boolean;
  chatHistory: ChatHistoryItem[];
  onHistoryClick: (sessionId: string) => void;
  activeSessionId?: string;
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
}: HistorySectionProps) {
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
          'overflow-y-auto pb-4',
          isCollapsed ? 'max-h-none' : 'max-h-[calc(100vh-300px)]',
        )}
      >
        {chatHistory.map((item) => (
          <HistoryItem
            key={item.id}
            text={item.title}
            isCollapsed={isCollapsed}
            onClick={() => onHistoryClick(item.id)}
            isActive={item.id === activeSessionId}
          />
        ))}
      </div>
    </>
  );
}
