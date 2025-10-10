import { getAuthContext } from '@/lib/auth-utils';
import { getConversationChecklists } from '@/lib/api-client';

export async function GET(
  _req: Request,
  { params }: { params: { conversationId: string } },
) {
  try {
    const { token, apiUrl } = await getAuthContext();
    const response = await getConversationChecklists(token, apiUrl, params.conversationId);

    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[Conversation Checklists API] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch conversation checklists.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
