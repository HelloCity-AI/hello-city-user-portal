/**
 * AI Chat Streaming Endpoint - Phase 3 Real AI Integration
 *
 * Architecture: Frontend (AI SDK) → Next.js Edge → .NET ChatProxy → Python AI Service
 *
 * Supports:
 * - data-task-id / data-checklist-* custom data parts for checklist workflow
 * - Streaming Assistant responses via Vercel AI SDK protocol
 * - Correlation ID for distributed tracing
 */
import { getAuthContext } from '@/lib/auth-utils';
import {
  convertUIMessagesToBackendFormat,
  createAISDKStream,
  type UIMessage,
} from '@/utils/chatStreamUtils';
import { logInfo, logError, generateCorrelationId } from '@/lib/logger';

export const runtime = 'edge';

export async function POST(req: Request) {
  const correlationId = generateCorrelationId();
  const startTime = Date.now();

  try {
    const { token, apiUrl } = await getAuthContext();
    const { messages, conversationId } = await req.json();

    logInfo('Chat request received', {
      correlation_id: correlationId,
      conversation_id: conversationId,
      message_count: messages?.length || 0,
    });

    // Transform AI SDK format (parts[]) to Backend format (content string)
    const convertedMessages = convertUIMessagesToBackendFormat(messages as UIMessage[]);

    // Forward to .NET ChatProxy with correlation_id
    const response = await fetch(`${apiUrl}/api/ChatProxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Correlation-ID': correlationId,
      },
      body: JSON.stringify({
        conversationId,
        messages: convertedMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logError('Backend returned error', new Error(`Status ${response.status}: ${errorText}`), {
        correlation_id: correlationId,
        conversation_id: conversationId,
        status: response.status,
      });
      throw new Error(`Backend returned ${response.status}: ${errorText}`);
    }

    logInfo('Backend responded, starting stream', {
      correlation_id: correlationId,
      conversation_id: conversationId,
      elapsed_ms: Date.now() - startTime,
    });

    // Transform backend SSE stream to AI SDK streaming protocol
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const stream = createAISDKStream(reader);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'x-vercel-ai-ui-message-stream': 'v1',
        'X-Correlation-ID': correlationId,
      },
    });
  } catch (error) {
    logError('Chat request failed', error as Error, {
      correlation_id: correlationId,
      elapsed_ms: Date.now() - startTime,
    });

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
      },
    });
  }
}
