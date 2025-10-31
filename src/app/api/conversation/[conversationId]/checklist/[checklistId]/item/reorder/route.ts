import { type NextRequest, NextResponse } from 'next/server';
import { getAuthContext, AuthError } from '@/lib/auth-utils';
import { handleApiError } from '@/lib/error-handlers';
import { reorderChecklistItems } from '@/lib/api-client';

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ conversationId: string; checklistId: string }> },
): Promise<NextResponse> {
  const params = await props.params;
  try {
    const body = await request.json();
    const { itemIds } = body;

    if (!Array.isArray(itemIds)) {
      return NextResponse.json({ error: 'itemIds must be an array' }, { status: 400 });
    }

    const { token, apiUrl } = await getAuthContext();
    const response = await reorderChecklistItems(
      token,
      apiUrl,
      params.conversationId,
      params.checklistId,
      itemIds,
    );

    // Handle 204 No Content response properly
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'reordering checklist items');
  }
}
