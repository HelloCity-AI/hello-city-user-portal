import { type NextRequest, NextResponse } from 'next/server';
import { getAuthContext, AuthError } from '@/lib/auth-utils';
import { handleApiError } from '@/lib/error-handlers';
import { createChecklistItem } from '@/lib/api-client';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ conversationId: string; checklistId: string }> }
): Promise<NextResponse> {
  const params = await props.params;
  try {
    const body = await request.json();
    const { token, apiUrl } = await getAuthContext();
    const response = await createChecklistItem(
      token,
      apiUrl,
      params.conversationId,
      params.checklistId,
      body,
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'creating checklist item');
  }
}
