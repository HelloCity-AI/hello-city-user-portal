import { type NextRequest, NextResponse } from 'next/server';
import { getAuthContext, AuthError } from '@/lib/auth-utils';
import { handleApiError } from '@/lib/error-handlers';
import { getConversationMessages } from '@/lib/api-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } },
) {
  try {
    const { token, apiUrl } = await getAuthContext();
    const response = await getConversationMessages(token, apiUrl, params.conversationId);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'getting messages');
  }
}
