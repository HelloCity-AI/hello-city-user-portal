import { type NextRequest, NextResponse } from 'next/server';
import { getAuthContext, AuthError } from '@/lib/auth-utils';
import { handleApiError } from '@/lib/error-handlers';
import { updateChecklistItem, deleteChecklistItem } from '@/lib/api-client';

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ conversationId: string; checklistId: string; itemId: string }> }
): Promise<NextResponse> {
  const params = await props.params;
  try {
    const body = await request.json();
    const { token, apiUrl } = await getAuthContext();
    const response = await updateChecklistItem(
      token,
      apiUrl,
      params.conversationId,
      params.checklistId,
      params.itemId,
      body,
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'updating checklist item');
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<{ conversationId: string; checklistId: string; itemId: string }> }
): Promise<NextResponse> {
  const params = await props.params;
  try {
    const { token, apiUrl } = await getAuthContext();
    await deleteChecklistItem(
      token,
      apiUrl,
      params.conversationId,
      params.checklistId,
      params.itemId,
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'deleting checklist item');
  }
}
