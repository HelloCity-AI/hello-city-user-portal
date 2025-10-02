import { type NextRequest, NextResponse } from 'next/server';
import { getAuthContext, AuthError } from '@/lib/auth-utils';
import { handleApiError } from '@/lib/error-handlers';
import { getConversations } from '@/lib/api-client';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const { token, apiUrl } = await getAuthContext();
    const response = await getConversations(token, apiUrl);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'getting conversations');
  }
}
