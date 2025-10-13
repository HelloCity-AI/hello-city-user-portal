/**
 * Global Task Poller
 * Monitors all active tasks in Redux and polls their status
 * Runs at app root level, independent of conversation navigation
 */

'use client';

import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '@/store';
import { updateTaskStatus, removeTask } from '@/store/slices/conversation';
import { fetchConversationChecklists } from '@/store/sagas/conversationSaga';
import { useTaskPolling, type TaskStatus } from '@/hooks/useTaskPolling';
import { useCallback } from 'react';

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

      if (task?.conversationId) {
        // Don't use Python's result (missing versionNumber)
        // Instead, fetch only checklists from .NET backend (lightweight, no message refetch)
        // This fetches from PostgreSQL with correct version information
        console.log(`[Global Poller] Refreshing checklists for conversation:`, task.conversationId);
        dispatch(fetchConversationChecklists(task.conversationId));
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
