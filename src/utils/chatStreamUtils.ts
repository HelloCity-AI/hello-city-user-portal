/**
 * Chat Stream Utilities for AI SDK Integration
 * Handles message format conversion and SSE stream processing
 */

export interface UIMessagePart {
  type: string;
  text: string;
}

export interface UIMessage {
  role: string;
  parts?: UIMessagePart[];
}

export interface BackendMessage {
  role: string;
  content: string;
  parts?: UIMessagePart[];
}

/**
 * Convert AI SDK UIMessage format to Backend-compatible format
 * Merges parts[] array into a single content string
 */
export function convertUIMessagesToBackendFormat(messages: UIMessage[]): BackendMessage[] {
  return messages.map((msg) => ({
    role: msg.role,
    // Merge all parts' text (AI SDK streaming may have multiple parts)
    content: msg.parts?.map((part) => part.text).join('') || '',
    parts: msg.parts, // Preserve original parts for future use
  }));
}

/**
 * Create AI SDK compatible SSE stream with tool support
 * Handles tool-call and tool-result events for checklist generation
 */
export function createAISDKStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      let buffer = '';
      let hasStarted = false;
      let hasPrimedText = false;
      const messageId = crypto.randomUUID();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let streamClosed = false;

      const send = (data: string) => {
        if (streamClosed) return;
        try {
          controller.enqueue(encoder.encode(data));
        } catch {
          streamClosed = true;
        }
      };

      const sendLifecycleEvents = (events: Array<{ type: string; id?: string }>) => {
        if (streamClosed) return;
        events.forEach(({ type, id }) => {
          const event = id ? { type, id } : { type };
          send(`data: ${JSON.stringify(event)}\n\n`);
        });
      };

      const ensureStarted = () => {
        if (hasStarted) {
          // console.log('⏩ [ensureStarted] Already started, skipping');
          return;
        }
        // console.log('🚀 [ensureStarted] Starting new message with ID:', messageId);
        sendLifecycleEvents([
          { type: 'start' },
          { type: 'start-step' },
          { type: 'text-start', id: messageId },
        ]);
        hasStarted = true;
        if (!hasPrimedText) {
          hasPrimedText = true;
          // console.log('📝 [ensureStarted] Injecting priming text (space) to create message');
          send(
            `data: ${JSON.stringify({
              type: 'text-delta',
              id: messageId,
              delta: ' ',
            })}\n\n`,
          );
        }
      };

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Send finish lifecycle events
            sendLifecycleEvents([
              { type: 'text-end', id: messageId },
              { type: 'finish-step' },
              { type: 'finish' },
            ]);
            send(`data: [DONE]\n\n`);
            if (!streamClosed) {
              streamClosed = true;
              controller.close();
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              try {
                const parsed = JSON.parse(data);

                // Skip completion marker (handled by stream end)
                if (parsed.isComplete) {
                  continue;
                }

                // Handle task-id custom event (convert to data-task-id for AI SDK)
                if (parsed.type === 'task-id' && parsed.taskId) {
                  // console.log('[Chat Stream] Task ID received:', {
                  //   taskId: parsed.taskId,
                  //   status: parsed.status,
                  // });
                  ensureStarted();
                  // Convert to AI SDK data part format (data-* with data wrapper)
                  send(
                    `data: ${JSON.stringify({
                      type: 'data-task-id',
                      data: {
                        taskId: parsed.taskId,
                        status: parsed.status,
                      },
                    })}\n\n`,
                  );
                }
                // Handle checklist-pending event (already in data-* format from Python)
                else if (parsed.type === 'data-checklist-pending' && parsed.data) {
                  // console.log('[Chat Stream] Checklist pending received:', {
                  //   taskId: parsed.data.taskId,
                  //   status: parsed.data.status,
                  //   message: parsed.data.message,
                  // });
                  ensureStarted();
                  // Forward as-is (already in AI SDK format)
                  send(`data: ${JSON.stringify(parsed)}\n\n`);
                }
                // Handle data-checklist-banner event for immediate banner rendering
                else if (parsed.type === 'data-checklist-banner' && parsed.data) {
                  // console.log('🎯 [Chat Stream] Checklist banner received:', {
                  //   checklistId: parsed.data.checklistId,
                  //   status: parsed.data.status,
                  //   title: parsed.data.title,
                  //   conversationId: parsed.data.conversationId,
                  //   fullData: parsed.data,
                  // });
                  // console.log('🔄 [Chat Stream] Calling ensureStarted() for banner');
                  ensureStarted();
                  // console.log('📤 [Chat Stream] Forwarding banner to AI SDK');

                  // Python 端已修复，现在直接转发
                  send(`data: ${JSON.stringify(parsed)}\n\n`);
                }
                // Handle data-checklist custom event (Vercel AI SDK data part)
                else if (parsed.type === 'data-checklist' && parsed.data) {
                  // console.log('[Chat Stream] Checklist data received:', {
                  //   destination: parsed.data.destination,
                  //   duration: parsed.data.duration,
                  //   stayType: parsed.data.stayType,
                  //   phaseCount: parsed.data.phase_names?.length || 0,
                  // });
                  ensureStarted();

                  // Python 端已修复，现在直接转发
                  send(`data: ${JSON.stringify(parsed)}\n\n`);
                }
                // Handle text-delta event
                else if (parsed.type === 'text-delta' && parsed.delta) {
                  // Send start lifecycle events on first token
                  ensureStarted();

                  // Send text-delta in SSE format
                  send(
                    `data: ${JSON.stringify({
                      type: 'text-delta',
                      id: messageId,
                      delta: parsed.delta,
                    })}\n\n`,
                  );

                  // Add async delay to prevent browser batching
                  await new Promise((resolve) => setTimeout(resolve, 10));
                }
              } catch (e) {
                console.error('[Chat Stream] Failed to parse SSE data:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('[Chat Stream] Stream error:', error);
        if (!streamClosed) {
          streamClosed = true;
          controller.error(error);
        }
      }
    },
  });
}
