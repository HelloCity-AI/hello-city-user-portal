/**
 * Global Task Poller
 * Monitors all active tasks in Redux and polls their status
 * Runs at app root level, independent of conversation navigation
 */

'use client';

import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '@/store';
import { updateTaskStatus, removeTask } from '@/store/slices/conversation';
import { addChecklist } from '@/store/slices/checklist';
import { useTaskPolling, type TaskStatus } from '@/hooks/useTaskPolling';
import { useCallback } from 'react';
import type { ChecklistMetadata } from '@/compoundComponents/ChatPage/ChecklistPanel/types';

function TaskPoller({ taskId }: { taskId: string }) {
  const dispatch = useDispatch();
  const activeTasks = useSelector((state: RootState) => state.conversation.activeTasks);
  const task = activeTasks[taskId];

  const handleStatusChange = useCallback(
    (status: TaskStatus) => {
      console.log(`[Global Poller] Task ${taskId} status:`, status.status);
      dispatch(updateTaskStatus({ taskId, status: status.status }));
    },
    [taskId, dispatch],
  );

  const handleComplete = useCallback(
    (result: unknown) => {
      console.log(`[Global Poller] Task ${taskId} completed:`, result);

      if (task?.conversationId && result) {
        // Validate result is ChecklistMetadata format
        const checklist = result as ChecklistMetadata;

        // Save checklist data to checklist Redux slice
        // This will:
        // 1. Store full checklist in state.checklists[checklistId]
        // 2. Create banner in state.bannersByConversation[conversationId]
        // 3. Auto-activate the checklist (set activeChecklistId)
        dispatch(addChecklist(checklist));

        console.log(`[Global Poller] Checklist added to Redux:`, {
          checklistId: checklist.checklistId,
          conversationId: task.conversationId,
          itemCount: checklist.items?.length || 0,
        });
      }

      // Remove task from active tasks
      dispatch(removeTask(taskId));
    },
    [taskId, task, dispatch],
  );

  const handleError = useCallback(
    (error: string) => {
      console.error(`[Global Poller] Task ${taskId} error:`, error);
      // TODO: Show error notification
      dispatch(removeTask(taskId));
    },
    [taskId, dispatch],
  );

  useTaskPolling({
    taskId,
    onStatusChange: handleStatusChange,
    onComplete: handleComplete,
    onError: handleError,
  });

  return null;
}

export function GlobalTaskPoller() {
  const activeTasks = useSelector((state: RootState) => state.conversation.activeTasks);
  const taskIds = Object.keys(activeTasks);

  return (
    <>
      {taskIds.map((taskId) => (
        <TaskPoller key={taskId} taskId={taskId} />
      ))}
    </>
  );
}
