import { type NextRequest, NextResponse } from 'next/server';
import { getAuthContext, AuthError } from '@/lib/auth-utils';
import { handleApiError } from '@/lib/error-handlers';
import { getConversation, deleteConversation, updateConversation } from '@/lib/api-client';

export async function GET(
  _request: NextRequest,
  { params }: { params: { conversationId: string } },
): Promise<NextResponse> {
  try {
    const { token, apiUrl } = await getAuthContext();
    const response = await getConversation(token, apiUrl, params.conversationId);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'getting conversation');
  }
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: { conversationId: string } },
  title: string,
): Promise<NextResponse> {
  try {
    const { token, apiUrl } = await getAuthContext();
    const response = await updateConversation(token, apiUrl, params.conversationId, {
      title: title,
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'updating conversation');
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { conversationId: string } },
): Promise<NextResponse> {
  try {
    const { token, apiUrl } = await getAuthContext();
    const response = await deleteConversation(token, apiUrl, params.conversationId);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (error instanceof AuthError) {
      return error.response;
    }
    return handleApiError(error, 'deleting conversation');
  }
}
