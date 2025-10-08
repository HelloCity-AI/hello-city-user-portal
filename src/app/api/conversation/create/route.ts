import { type NextRequest, NextResponse } from 'next/server';
import { getAuthContext, AuthError } from '@/lib/auth-utils';
import { handleApiError } from '@/lib/error-handlers';
import { createConversation } from '@/lib/api-client';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { token, apiUrl } = await getAuthContext();
    const { title, firstMessage } = await request.json();

    const response = await createConversation(token, apiUrl, title, firstMessage);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'creating conversation');
  }
}
