import axios, { type AxiosResponse } from 'axios';

/**
 * Create a configured axios instance for backend API calls
 */
export function createApiClient(baseURL: string, token: string) {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
}

/**
 * Fetch user profile with proper error handling
 */
export async function fetchUserProfile(token: string, backendUrl: string): Promise<AxiosResponse> {
  const userResponse = await axios.get(`${backendUrl}/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-store',
      Accept: 'application/json',
    },
    timeout: 10000,
    validateStatus: (status) => status === 200 || status === 404,
  });
  return userResponse;
}

/**
 * Create user profile
 */
export async function createUserProfile(
  token: string,
  backendUrl: string,
  formData: FormData,
): Promise<AxiosResponse> {
  const response = await axios.post(`${backendUrl}/api/user`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
    timeout: 10000,
  });
  return response;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  token: string,
  backendUrl: string,
  userData: any,
): Promise<AxiosResponse> {
  const response = await axios.put(`${backendUrl}/api/user/me`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });
  return response;
}

/**
 * Delete user profile
 */
export async function deleteUserProfile(token: string, backendUrl: string): Promise<AxiosResponse> {
  const response = await axios.delete(`${backendUrl}/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000,
  });
  return response;
}

/**
 * Update current user profile without GUID
 * Backend consumes multipart/form-data for EditUserDto via /api/user/me
 */
export async function updateCurrentUserProfile(
  token: string,
  backendUrl: string,
  formData: FormData,
): Promise<AxiosResponse> {
  const response = await axios.put(`${backendUrl}/api/user/me`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // Let axios set proper multipart boundary, keep Accept permissive
      Accept: '*/*',
    },
    timeout: 10000,
  });
  return response;
}

export async function getConversations(token: string, backendUrl: string): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.get('/api/conversation/me');
}

export async function getConversation(
  token: string,
  backendUrl: string,
  id: string,
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.get(`/api/conversation/${id}`);
}

export async function updateConversation(
  token: string,
  backendUrl: string,
  id: string,
  data: object,
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.patch(`/api/conversation/${id}`, data);
}

export async function deleteConversation(
  token: string,
  backendUrl: string,
  id: string,
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.delete(`/api/conversation/${id}`);
}

export async function getConversationMessages(
  token: string,
  backendUrl: string,
  id: string,
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.get(`/api/conversation/${id}/messages`);
}

export async function getConversationChecklists(
  token: string,
  backendUrl: string,
  id: string,
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.get(`/api/conversation/${id}/checklists`);
}

export async function createConversation(
  token: string,
  backendUrl: string,
  title: string = 'New Conversation',
  firstMessage?: string,
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.post('/api/Conversation', {
    title,
    firstMessage,
  });
}

/**
 * Create a new checklist item
 */
export async function createChecklistItem(
  token: string,
  backendUrl: string,
  conversationId: string,
  checklistId: string,
  data: object,
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.post(
    `/api/conversation/${conversationId}/checklist/${checklistId}/item`,
    data,
  );
}

/**
 * Update a checklist item
 */
export async function updateChecklistItem(
  token: string,
  backendUrl: string,
  conversationId: string,
  checklistId: string,
  itemId: string,
  data: object,
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.put(
    `/api/conversation/${conversationId}/checklist/${checklistId}/item/${itemId}`,
    data,
  );
}

/**
 * Toggle checklist item completion status
 */
export async function toggleChecklistItemComplete(
  token: string,
  backendUrl: string,
  conversationId: string,
  checklistId: string,
  itemId: string,
  isComplete: boolean,
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.patch(
    `/api/conversation/${conversationId}/checklist/${checklistId}/item/${itemId}/complete`,
    { isComplete },
  );
}

/**
 * Delete a checklist item
 */
export async function deleteChecklistItem(
  token: string,
  backendUrl: string,
  conversationId: string,
  checklistId: string,
  itemId: string,
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.delete(
    `/api/conversation/${conversationId}/checklist/${checklistId}/item/${itemId}`,
  );
}

/**
 * Reorder checklist items
 */
export async function reorderChecklistItems(
  token: string,
  backendUrl: string,
  conversationId: string,
  checklistId: string,
  itemIds: string[],
): Promise<AxiosResponse> {
  const client = createApiClient(backendUrl, token);
  return await client.put(
    `/api/conversation/${conversationId}/checklist/${checklistId}/item/reorder`,
    { itemIds },
  );
}
