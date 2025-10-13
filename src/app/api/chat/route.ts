/**
 * AI Chat Streaming Endpoint - Phase 3 Real AI Integration
 *
 * Architecture: Frontend (AI SDK) → Next.js Edge → .NET ChatProxy → Python AI Service
 *
 * Supports:
 * - data-task-id / data-checklist-* custom data parts for checklist workflow
 * - Streaming Assistant responses via Vercel AI SDK protocol
 */
import { getAuthContext } from '@/lib/auth-utils';
import {
  convertUIMessagesToBackendFormat,
  createAISDKStream,
  type UIMessage,
} from '@/utils/chatStreamUtils';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { token, apiUrl } = await getAuthContext();
    const { messages, conversationId } = await req.json();

    // Transform AI SDK format (parts[]) to Backend format (content string)
    const convertedMessages = convertUIMessagesToBackendFormat(messages as UIMessage[]);

    // DEBUG: Log outgoing messages to Backend
    console.log('[API Chat] Sending to backend:', {
      conversationId,
      messageCount: convertedMessages.length,
      messages: convertedMessages.map((m) => ({
        role: m.role,
        contentLength: m.content?.length || 0,
        partsCount: m.parts?.length || 0,
        contentPreview: m.content?.substring(0, 50) || '[EMPTY]',
      })),
    });

    // Forward to .NET ChatProxy (real AI service)
    const response = await fetch(`${apiUrl}/api/ChatProxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        conversationId,
        messages: convertedMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API Chat] Backend error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Backend returned ${response.status}: ${errorText}`);
    }

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
      },
    });
  } catch (error) {
    console.error('[API Chat] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
