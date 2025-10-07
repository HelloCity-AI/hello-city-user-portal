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
 * Create AI SDK compatible SSE stream from backend response
 * Transforms backend SSE format to AI SDK streaming protocol
 */
export function createAISDKStream(reader: ReadableStreamDefaultReader<Uint8Array>): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      let buffer = '';
      let hasStarted = false;
      const messageId = crypto.randomUUID();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      const send = (data: string) => {
        controller.enqueue(encoder.encode(data));
      };

      const sendLifecycleEvents = (events: Array<{ type: string; id?: string }>) => {
        events.forEach(({ type, id }) => {
          const event = id ? { type, id } : { type };
          send(`data: ${JSON.stringify(event)}\n\n`);
        });
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
            controller.close();
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

                if (parsed.type === 'text-delta' && parsed.delta) {
                  // Send start lifecycle events on first token
                  if (!hasStarted) {
                    sendLifecycleEvents([
                      { type: 'start' },
                      { type: 'start-step' },
                      { type: 'text-start', id: messageId },
                    ]);
                    hasStarted = true;
                  }

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
        controller.error(error);
      }
    },
  });
}

/**
 * Create AI SDK compatible SSE stream with tool support (V2)
 * Handles tool-call and tool-result events for checklist generation
 */
export function createAISDKStreamV2(
  reader: ReadableStreamDefaultReader<Uint8Array>,
): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      let buffer = '';
      let hasStarted = false;
      const messageId = crypto.randomUUID();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      const send = (data: string) => {
        controller.enqueue(encoder.encode(data));
      };

      const sendLifecycleEvents = (events: Array<{ type: string; id?: string }>) => {
        events.forEach(({ type, id }) => {
          const event = id ? { type, id } : { type };
          send(`data: ${JSON.stringify(event)}\n\n`);
        });
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
            controller.close();
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

                // Handle data-checklist custom event (Vercel AI SDK data part)
                if (parsed.type === 'data-checklist' && parsed.data) {
                  console.log('[Chat Stream V2] Checklist data received:', parsed.data.title);
                  // Forward as-is to AI SDK (will be added to message.parts)
                  send(`data: ${JSON.stringify(parsed)}\n\n`);
                }
                // Handle text-delta event
                else if (parsed.type === 'text-delta' && parsed.delta) {
                  // Send start lifecycle events on first token
                  if (!hasStarted) {
                    sendLifecycleEvents([
                      { type: 'start' },
                      { type: 'start-step' },
                      { type: 'text-start', id: messageId },
                    ]);
                    hasStarted = true;
                  }

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
                console.error('[Chat Stream V2] Failed to parse SSE data:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('[Chat Stream V2] Stream error:', error);
        controller.error(error);
      }
    },
  });
}
