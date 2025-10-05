import { getAuthContext } from '@/lib/auth-utils';

export const runtime = 'edge';

interface UIMessagePart {
  type: string;
  text: string;
}

interface UIMessage {
  role: string;
  parts?: UIMessagePart[];
}

export async function POST(req: Request) {
  try {
    // 1. 验证Auth0身份
    const { token, apiUrl } = await getAuthContext();

    // 2. 解析请求体
    const { messages, conversationId } = await req.json();

    // 3. 转换 UIMessage 格式为 Backend 兼容格式
    // UIMessage: { role, parts: [{ text }] } → Backend: { role, content, parts }
    const convertedMessages = (messages as UIMessage[]).map((msg) => ({
      role: msg.role,
      // 合并所有 parts 的 text（AI SDK 流式回复可能有多个 parts）
      content: msg.parts?.map((part) => part.text).join('') || '',
      parts: msg.parts, // 保留原始 parts 供未来使用
    }));

    // 4. 构建发送给.NET backend的请求
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

    // 4. 转换 backend SSE 流为 AI SDK 格式
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = '';
        let hasStarted = false;
        const messageId = crypto.randomUUID();

        const send = (data: string) => {
          controller.enqueue(new TextEncoder().encode(data));
        };

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // Send finish lifecycle events
              send(`data: ${JSON.stringify({ type: 'text-end', id: messageId })}\n\n`);
              send(`data: ${JSON.stringify({ type: 'finish-step' })}\n\n`);
              send(`data: ${JSON.stringify({ type: 'finish' })}\n\n`);
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
                      send(`data: ${JSON.stringify({ type: 'start' })}\n\n`);
                      send(`data: ${JSON.stringify({ type: 'start-step' })}\n\n`);
                      send(`data: ${JSON.stringify({ type: 'text-start', id: messageId })}\n\n`);
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
                  console.error('[API Chat] Failed to parse SSE data:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('[API Chat] Stream error:', error);
          controller.error(error);
        }
      },
    });

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
