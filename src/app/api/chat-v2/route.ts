/**
 * AI Chat Streaming Endpoint V2 - Phase 3 Real AI Integration
 *
 * Architecture: Frontend (AI SDK) → Next.js Edge → .NET ChatProxy → Python AI Service
 *
 * Changes from Phase 2:
 * - Now calls /api/ChatProxy (connects to real Python AI service)
 * - Supports data-checklist custom data parts
 * - Python returns real AI-generated checklist metadata
 */
import { getAuthContext } from '@/lib/auth-utils';
import {
  convertUIMessagesToBackendFormat,
  createAISDKStreamV2,
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
    console.log('[API Chat V2] Sending to backend:', {
      conversationId,
      messageCount: convertedMessages.length,
      messages: convertedMessages.map((m) => ({
        role: m.role,
        contentLength: m.content?.length || 0,
        partsCount: m.parts?.length || 0,
        contentPreview: m.content?.substring(0, 50) || '[EMPTY]',
      })),
    });

    // Forward to .NET ChatProxyV2 (mock endpoint)
    const response = await fetch(`${apiUrl}/api/ChatProxyV2`, {
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
      console.error('[API Chat V2] Backend error:', {
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

    const stream = createAISDKStreamV2(reader);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'x-vercel-ai-ui-message-stream': 'v1',
      },
    });
  } catch (error) {
    console.error('[API Chat V2] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
