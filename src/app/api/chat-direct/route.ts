import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  console.log('[API Chat-Direct] Received messages:', JSON.stringify(messages, null, 2));

  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant.',
    messages: convertToModelMessages(messages),
  });

  console.log('[API Chat-Direct] Returning toUIMessageStreamResponse()');

  return result.toUIMessageStreamResponse();
}
