// Mock next/server
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url: string, init?: any) => ({
    url,
    method: init?.method || 'GET',
    headers: new Map(Object.entries(init?.headers || {})),
    body: init?.body,
    json: jest.fn().mockImplementation(() => {
      if (init?.body) {
        try {
          return Promise.resolve(JSON.parse(init.body));
        } catch (error) {
          return Promise.reject(new SyntaxError('Unexpected token in JSON'));
        }
      }
      return Promise.resolve({});
    }),
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((data: any, init?: { status?: number }) => ({
      json: jest.fn().mockResolvedValue(data),
      status: init?.status || 200,
    })),
  },
}));

import { NextRequest } from 'next/server';
import { GET, PUT } from '@/app/api/user/me/route';
import { getAccessTokenWithValidation, validateBackendUrl, getBackendUrl } from '@/lib/auth-utils';
import { fetchUserProfile, updateCurrentUserProfile } from '@/lib/api-client';
import { handleApiError, handleAxiosError } from '@/lib/error-handlers';
import axios from 'axios';

// Mock all dependencies
jest.mock('@/lib/auth-utils');
jest.mock('@/lib/api-client');
jest.mock('@/lib/error-handlers');
jest.mock('axios');

// Type the mocked functions
const mockGetAccessTokenWithValidation = getAccessTokenWithValidation as jest.Mock;
const mockValidateBackendUrl = validateBackendUrl as jest.Mock;
const mockGetBackendUrl = getBackendUrl as jest.Mock;
const mockFetchUserProfile = fetchUserProfile as jest.Mock;
const mockUpdateCurrentUserProfile = updateCurrentUserProfile as jest.Mock;
const mockHandleApiError = handleApiError as jest.Mock;
const mockHandleAxiosError = handleAxiosError as jest.Mock;
const mockAxiosIsAxiosError = axios.isAxiosError as unknown as jest.Mock;

// Mock data
const mockUserData = {
  UserId: '123e4567-e89b-12d3-a456-426614174000',
  Email: 'test@example.com',
  FirstName: 'Test',
  LastName: 'User',
  Gender: 'Male',
  city: 'Test City',
  nationality: 'Test Country',
  preferredLanguage: 'en',
  Avatar: 'avatar-url',
  university: 'Test University',
  major: 'Computer Science',
};

const mockToken = 'mock-access-token';
const mockApiUrl = 'https://api.example.com';

describe('/api/user/me', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default successful mocks
    mockValidateBackendUrl.mockReturnValue(null);
    mockGetAccessTokenWithValidation.mockResolvedValue({
      token: mockToken,
    });
    mockGetBackendUrl.mockReturnValue(mockApiUrl);
  });

  describe('GET', () => {
    beforeEach(() => {
      mockFetchUserProfile.mockResolvedValue({
        data: mockUserData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });
    });

    it('should fetch user profile successfully', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await GET(request);

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalled();
      expect(mockGetAccessTokenWithValidation).toHaveBeenCalled();
      expect(mockGetBackendUrl).toHaveBeenCalled();
      expect(mockFetchUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl);
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual(mockUserData);
    });

    it('should handle backend URL validation error', async () => {
      // Arrange
      const mockErrorResponse = new Response('Backend URL error', { status: 500 });
      mockValidateBackendUrl.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await GET(request);

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalled();
      expect(mockGetAccessTokenWithValidation).not.toHaveBeenCalled();
      expect(response).toBe(mockErrorResponse);
    });

    it('should handle authentication error', async () => {
      // Arrange
      const mockErrorResponse = new Response('Unauthorized', { status: 401 });
      mockGetAccessTokenWithValidation.mockResolvedValue({
        error: mockErrorResponse,
      });

      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await GET(request);

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalled();
      expect(mockGetAccessTokenWithValidation).toHaveBeenCalled();
      expect(mockFetchUserProfile).not.toHaveBeenCalled();
      expect(response).toBe(mockErrorResponse);
    });

    it('should handle API errors', async () => {
      // Arrange
      const mockError = new Error('API Error');
      const mockErrorResponse = new Response('Internal Server Error', { status: 500 });
      mockFetchUserProfile.mockRejectedValue(mockError);
      mockHandleApiError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await GET(request);

      // Assert
      expect(mockFetchUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl);
      expect(mockHandleApiError).toHaveBeenCalledWith(mockError, 'getting user profile');
      expect(response).toBe(mockErrorResponse);
    });
  });

  describe('PUT', () => {
    const updateData = {
      FirstName: 'Updated',
      LastName: 'User',
      city: 'Updated City',
    };

    beforeEach(() => {
      // Ensure current user GUID is available for PUT flow
      mockFetchUserProfile.mockResolvedValue({
        data: mockUserData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });
      mockUpdateCurrentUserProfile.mockResolvedValue({
        data: { ...mockUserData, ...updateData },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });
    });

    it('should update user profile successfully', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/user/me', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Act
      const response = await PUT(request);

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalled();
      expect(mockGetAccessTokenWithValidation).toHaveBeenCalled();
      expect(mockGetBackendUrl).toHaveBeenCalled();
      expect(mockUpdateCurrentUserProfile).toHaveBeenCalledWith(
        mockToken,
        mockApiUrl,
        expect.any(FormData),
      );
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({ ...mockUserData, ...updateData });
    });

    it('should handle backend URL validation error', async () => {
      // Arrange
      const mockErrorResponse = new Response('Backend URL error', { status: 500 });
      mockValidateBackendUrl.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Act
      const response = await PUT(request);

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalled();
      expect(mockGetAccessTokenWithValidation).not.toHaveBeenCalled();
      expect(response).toBe(mockErrorResponse);
    });

    it('should handle authentication error', async () => {
      // Arrange
      const mockErrorResponse = new Response('Unauthorized', { status: 401 });
      mockGetAccessTokenWithValidation.mockResolvedValue({
        error: mockErrorResponse,
      });

      const request = new NextRequest('http://localhost:3000/api/user/me', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Act
      const response = await PUT(request);

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalled();
      expect(mockGetAccessTokenWithValidation).toHaveBeenCalled();
      expect(mockUpdateCurrentUserProfile).not.toHaveBeenCalled();
      expect(response).toBe(mockErrorResponse);
    });

    it('should handle axios errors', async () => {
      // Arrange
      const mockAxiosError = {
        isAxiosError: true,
        response: { status: 404, data: { message: 'User not found' } },
      };
      const mockErrorResponse = new Response('User not found', { status: 404 });

      mockUpdateCurrentUserProfile.mockRejectedValue(mockAxiosError);
      mockAxiosIsAxiosError.mockReturnValue(true);
      mockHandleAxiosError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Act
      const response = await PUT(request);

      // Assert
      expect(mockUpdateCurrentUserProfile).toHaveBeenCalledWith(
        mockToken,
        mockApiUrl,
        expect.any(FormData),
      );
      expect(mockAxiosIsAxiosError).toHaveBeenCalledWith(mockAxiosError);
      expect(mockHandleAxiosError).toHaveBeenCalledWith(mockAxiosError, 'update user');
      expect(response).toBe(mockErrorResponse);
    });

    it('should handle general API errors', async () => {
      // Arrange
      const mockError = new Error('General Error');
      const mockErrorResponse = new Response('Internal Server Error', { status: 500 });
      mockUpdateCurrentUserProfile.mockRejectedValue(mockError);
      mockAxiosIsAxiosError.mockReturnValue(false);
      mockHandleApiError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Act
      const response = await PUT(request);

      // Assert
      expect(mockUpdateCurrentUserProfile).toHaveBeenCalledWith(
        mockToken,
        mockApiUrl,
        expect.any(FormData),
      );
      expect(mockHandleApiError).toHaveBeenCalledWith(mockError, 'updating user');
      expect(response).toBe(mockErrorResponse);
    });

    it('should handle JSON parsing errors', async () => {
      // Arrange
      const mockErrorResponse = new Response('Bad Request', { status: 400 });
      mockHandleApiError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me', {
        method: 'PUT',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Act
      const response = await PUT(request);

      // Assert
      expect(mockHandleApiError).toHaveBeenCalledWith(expect.any(Error), 'updating user');
      expect(response).toBe(mockErrorResponse);
    });
  });
});
