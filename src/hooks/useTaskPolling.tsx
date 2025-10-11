/**
 * useTaskPolling Hook
 * Polls task status with exponential backoff
 */

import { useEffect, useRef, useCallback } from 'react';

export interface TaskStatus {
  taskId: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
}

export interface UseTaskPollingOptions {
  /** Task ID to poll */
  taskId: string | null;
  /** Callback when status changes */
  onStatusChange?: (status: TaskStatus) => void;
  /** Callback when task completes */
  onComplete?: (result: unknown) => void;
  /** Callback when task fails or times out */
  onError?: (error: string) => void;
  /** Maximum polling duration in milliseconds (default: 5 minutes) */
  maxDuration?: number;
  /** Initial polling interval in milliseconds (default: 1000 = 1s) */
  initialInterval?: number;
}

/**
 * Poll task status with exponential backoff
 * Intervals: 1s → 2s → 5s → 5s... (max 5s)
 * Auto-stops on: completed, failed, or timeout
 */
export function useTaskPolling({
  taskId,
  onStatusChange,
  onComplete,
  onError,
  maxDuration = 5 * 60 * 1000,
  initialInterval = 1000,
}: UseTaskPollingOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const currentIntervalRef = useRef<number>(initialInterval);
  const pollCountRef = useRef<number>(0);

  // Use refs to store callbacks (avoid dependency issues)
  const onStatusChangeRef = useRef(onStatusChange);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change (without triggering effect)
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
  }, [onStatusChange, onComplete, onError]);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!taskId) {
      return;
    }

    console.log(`[Task Polling] Starting polling for task: ${taskId}`);
    startTimeRef.current = Date.now();
    currentIntervalRef.current = initialInterval;
    pollCountRef.current = 0;

    const executePoll = async () => {
      const elapsed = Date.now() - startTimeRef.current;

      // Timeout check
      if (elapsed >= maxDuration) {
        console.warn(`[Task Polling] Timeout after ${elapsed}ms`);
        cleanup();
        onErrorRef.current?.('Task polling timeout');
        return;
      }

      console.log(`[Task Polling] Poll #${pollCountRef.current + 1} at ${elapsed}ms`);

      // Poll task status (inline logic)
      try {
        const response = await fetch(`/api/tasks/${taskId}/status`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: TaskStatus = await response.json();

        onStatusChangeRef.current?.(data);

        // Stop polling on terminal states
        if (data.status === 'completed') {
          cleanup();
          onCompleteRef.current?.(data.result);
          return; // Don't schedule next poll
        } else if (data.status === 'failed') {
          cleanup();
          onErrorRef.current?.(data.error || 'Task failed');
          return; // Don't schedule next poll
        }
      } catch (error) {
        console.error('[Task Polling] Error:', error);
        cleanup();
        onErrorRef.current?.(error instanceof Error ? error.message : 'Unknown error');
        return; // Don't schedule next poll
      }

      pollCountRef.current++;

      // Exponential backoff: 1s → 2s → 5s (max)
      if (pollCountRef.current === 1) {
        currentIntervalRef.current = 2000; // After 1st poll: next in 2s
      } else if (pollCountRef.current === 2) {
        currentIntervalRef.current = 5000; // After 2nd poll: next in 5s
      }
      // After 3rd poll onwards: stay at 5s

      // Schedule next poll
      intervalRef.current = setTimeout(executePoll, currentIntervalRef.current);
    };

    // Initial poll
    executePoll();

    // Cleanup on unmount or taskId change
    return cleanup;
  }, [taskId, maxDuration, initialInterval, cleanup]);

  return {
    /** Stop polling manually */
    stopPolling: cleanup,
  };
}
