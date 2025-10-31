import { type NextRequest, NextResponse } from 'next/server';
import { getAuthContext, AuthError } from '@/lib/auth-utils';
import { handleApiError } from '@/lib/error-handlers';
import { toggleChecklistItemComplete } from '@/lib/api-client';

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ conversationId: string; checklistId: string; itemId: string }> },
): Promise<NextResponse> {
  const params = await props.params;
  try {
    const body = await request.json();
    const { isComplete } = body;

    if (typeof isComplete !== 'boolean') {
      return NextResponse.json(
        { error: 'isComplete is required and must be a boolean' },
        { status: 400 },
      );
    }

    const { token, apiUrl } = await getAuthContext();
    const response = await toggleChecklistItemComplete(
      token,
      apiUrl,
      params.conversationId,
      params.checklistId,
      params.itemId,
      isComplete,
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'toggling checklist item complete');
  }
}
