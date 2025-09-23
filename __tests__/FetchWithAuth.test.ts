import { fetchWithAuth } from '../src/utils/fetchWithAuth';
import { getAccessToken } from '@auth0/nextjs-auth0';

// Mock the auth0 module
jest.mock('@auth0/nextjs-auth0', () => ({
  getAccessToken: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

const mockGetAccessToken = getAccessToken as jest.MockedFunction<typeof getAccessToken>;
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('fetchWithAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAccessToken.mockResolvedValue('mock-access-token');
    mockFetch.mockResolvedValue(new Response('{}', { status: 200 }));
  });

  it('should set Content-Type to application/json for regular requests', async () => {
    await fetchWithAuth('https://api.example.com/test', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
    });

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
      headers: expect.objectContaining({
        get: expect.any(Function),
        set: expect.any(Function),
      }),
    });

    const headers = mockFetch.mock.calls[0][1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer mock-access-token');
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('should not set Content-Type for FormData requests', async () => {
    const formData = new FormData();
    formData.append('file', new Blob(['test'], { type: 'text/plain' }), 'test.txt');
    formData.append('field', 'value');

    await fetchWithAuth('https://api.example.com/upload', {
      method: 'POST',
      body: formData,
    });

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/upload', {
      method: 'POST',
      body: formData,
      headers: expect.objectContaining({
        get: expect.any(Function),
        set: expect.any(Function),
      }),
    });

    const headers = mockFetch.mock.calls[0][1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer mock-access-token');
    expect(headers.get('Content-Type')).toBeNull();
  });

  it('should preserve existing headers while adding Authorization', async () => {
    await fetchWithAuth('https://api.example.com/test', {
      method: 'GET',
      headers: {
        'Custom-Header': 'custom-value',
      },
    });

    const headers = mockFetch.mock.calls[0][1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer mock-access-token');
    expect(headers.get('Custom-Header')).toBe('custom-value');
    expect(headers.get('Content-Type')).toBeNull(); // No Content-Type for GET requests without body
  });

  it('should not override caller-provided Content-Type', async () => {
    await fetchWithAuth('https://api.example.com/test', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
      headers: {
        'Content-Type': 'application/xml',
      },
    });

    const headers = mockFetch.mock.calls[0][1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer mock-access-token');
    expect(headers.get('Content-Type')).toBe('application/xml'); // Should preserve caller's Content-Type
  });
});
