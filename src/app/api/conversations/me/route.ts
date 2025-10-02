import { type NextRequest, NextResponse } from 'next/server';
import { getAccessTokenWithValidation, validateBackendUrl, getBackendUrl } from '@/lib/auth-utils';
import { handleApiError, handleAxiosError } from '@/lib/error-handlers';
import { fetchAllConversations } from '@/lib/api-client';
import axios from 'axios';

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const backendUrlError = validateBackendUrl();
    if (backendUrlError) {
      return backendUrlError;
    }

    const tokenResult = await getAccessTokenWithValidation();
    if (tokenResult.error) {
      return tokenResult.error;
    }

    const apiUrl = getBackendUrl()!;

    const conversationsResponse = await fetchAllConversations(tokenResult.token, apiUrl);

    return NextResponse.json(conversationsResponse.data, { status: conversationsResponse.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return handleAxiosError(error, 'fetch conversations failed');
    }
    return handleApiError(error, 'getting conversations');
  }
}
