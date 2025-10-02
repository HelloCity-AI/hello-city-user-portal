import { call, put, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import {
  setConversations,
  setLoading,
  setError,
  fetchAllConversations,
  type Conversation,
} from '../slices/conversation';

interface FetchConversationsResponse {
  status: number;
  data: Conversation[] | null | undefined;
  ok: boolean;
}

export async function fetchConversationsApiWrapper(): Promise<FetchConversationsResponse> {
  try {
    const response = await fetch('/api/conversations/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = response.ok ? await response.json() : null;

    return {
      status: response.status,
      data: data,
      ok: response.ok,
    };
  } catch (error) {
    console.error('Failed to fetch conversations:', error);

    return {
      status: 500,
      data: null,
      ok: false,
    };
  }
}

export function* handleFetchConversations(): SagaIterator {
  try {
    yield put(setLoading(true));

    const res: FetchConversationsResponse = yield call(fetchConversationsApiWrapper);

    if (res.data) {
      yield put(setConversations(res.data));
    } else {
      yield put(setError(`Failed to fetch conversations: ${res.status}`));
    }
  } catch (error: unknown) {
    console.error('Error in handleFetchConversations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    yield put(setError(errorMessage));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* conversationSaga() {
  yield takeLatest(fetchAllConversations.type, handleFetchConversations);
}
