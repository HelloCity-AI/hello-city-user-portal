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

import { NextRequest, NextResponse } from 'next/server';
import { GET, PUT } from '@/app/api/user/me/route';
import { fetchUserProfile, updateUserProfile } from '@/lib/api-client';
import { handleApiError } from '@/lib/error-handlers';

// Mock dependencies except AuthError class
jest.mock('@/lib/api-client');
jest.mock('@/lib/error-handlers');

// Partially mock auth-utils to preserve real AuthError class
jest.mock('@/lib/auth-utils', () => {
  const actual = jest.requireActual('@/lib/auth-utils');
  return {
    ...actual,
    getAuthContext: jest.fn(),
  };
});

import { getAuthContext, AuthError } from '@/lib/auth-utils';

// Type the mocked functions
const mockGetAuthContext = getAuthContext as jest.Mock;
const mockFetchUserProfile = fetchUserProfile as jest.Mock;
const mockUpdateUserProfile = updateUserProfile as jest.Mock;
const mockHandleApiError = handleApiError as jest.Mock;

// Mock data
const mockUserData = {
  userId: '123',
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

    // Default successful mock for getAuthContext
    mockGetAuthContext.mockResolvedValue({
      token: mockToken,
      apiUrl: mockApiUrl,
    });
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
      expect(mockGetAuthContext).toHaveBeenCalled();
      expect(mockFetchUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl);
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual(mockUserData);
    });

    it('should handle authentication error', async () => {
      // Arrange
      const mockErrorResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      mockGetAuthContext.mockRejectedValue(new AuthError(mockErrorResponse));

      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await GET(request);

      // Assert
      expect(mockGetAuthContext).toHaveBeenCalled();
      expect(mockFetchUserProfile).not.toHaveBeenCalled();
      expect(response).toBe(mockErrorResponse);
    });

    it('should handle API errors', async () => {
      // Arrange
      const mockError = new Error('API Error');
      const mockErrorResponse = NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      );
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
      mockUpdateUserProfile.mockResolvedValue({
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
      expect(mockGetAuthContext).toHaveBeenCalled();
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl, updateData);
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toEqual({ ...mockUserData, ...updateData });
    });

    it('should handle authentication error', async () => {
      // Arrange
      const mockErrorResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      mockGetAuthContext.mockRejectedValue(new AuthError(mockErrorResponse));

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
      expect(mockGetAuthContext).toHaveBeenCalled();
      expect(mockUpdateUserProfile).not.toHaveBeenCalled();
      expect(response).toBe(mockErrorResponse);
    });

    it('should handle general API errors', async () => {
      // Arrange
      const mockError = new Error('General Error');
      const mockErrorResponse = NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      );
      mockUpdateUserProfile.mockRejectedValue(mockError);
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
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl, updateData);
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
