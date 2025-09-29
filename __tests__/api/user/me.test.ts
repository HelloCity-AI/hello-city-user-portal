/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock all dependencies before importing the route handlers
jest.mock('@/lib/auth-utils', () => ({
  getAccessTokenWithValidation: jest.fn(),
  validateBackendUrl: jest.fn(),
  getBackendUrl: jest.fn(),
}));

jest.mock('@/lib/api-client', () => ({
  fetchUserProfile: jest.fn(),
  createUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  deleteUserProfile: jest.fn(),
}));

jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
}));

jest.mock('@/lib/error-handlers', () => ({
  handleApiError: jest.fn(),
  handleAxiosError: jest.fn(),
}));

// Import route handlers after mocking
import { GET, POST, PUT, DELETE } from '@/app/api/user/me/route';

// Import mocked modules to get typed references
import { getAccessTokenWithValidation, validateBackendUrl, getBackendUrl } from '@/lib/auth-utils';
import {
  fetchUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from '@/lib/api-client';
import { handleApiError, handleAxiosError } from '@/lib/error-handlers';
import axios from 'axios';

// Type the mocked functions
const mockGetAccessTokenWithValidation = getAccessTokenWithValidation as jest.Mock;
const mockValidateBackendUrl = validateBackendUrl as jest.Mock;
const mockGetBackendUrl = getBackendUrl as jest.Mock;
const mockFetchUserProfile = fetchUserProfile as jest.Mock;
const mockCreateUserProfile = createUserProfile as jest.Mock;
const mockUpdateUserProfile = updateUserProfile as jest.Mock;
const mockDeleteUserProfile = deleteUserProfile as jest.Mock;
const mockHandleApiError = handleApiError as jest.Mock;
const mockHandleAxiosError = handleAxiosError as jest.Mock;
const mockAxiosIsAxiosError = axios.isAxiosError as unknown as jest.Mock;

// Mock data
const mockUserData = {
  userId: '123',
  Email: 'test@example.com',
  FirstName: 'Test',
  LastName: 'User',
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

    // Reset API client mocks to default successful responses
    mockFetchUserProfile.mockResolvedValue({
      data: mockUserData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    mockCreateUserProfile.mockResolvedValue({
      data: { userId: '12345' },
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {} as any,
    });

    mockUpdateUserProfile.mockResolvedValue({
      data: mockUserData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    mockDeleteUserProfile.mockResolvedValue({
      data: null,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config: {} as any,
    });
  });

  describe('GET /api/user/me', () => {
    it('should successfully fetch user profile', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await GET(request);
      const responseData = await response.json();

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalledTimes(1);
      expect(mockGetAccessTokenWithValidation).toHaveBeenCalledTimes(1);
      expect(mockFetchUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl);
      expect(response.status).toBe(200);
      expect(responseData).toEqual(mockUserData);
    });

    it('should return error when backend URL validation fails', async () => {
      // Arrange
      const mockErrorResponse = NextResponse.json(
        { error: 'Backend URL not configured' },
        { status: 500 },
      );
      mockValidateBackendUrl.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await GET(request);

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalledTimes(1);
      expect(mockGetAccessTokenWithValidation).not.toHaveBeenCalled();
      expect(mockFetchUserProfile).not.toHaveBeenCalled();
      expect(response).toBe(mockErrorResponse);
    });

    it('should return error when token validation fails', async () => {
      // Arrange
      const mockErrorResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      mockGetAccessTokenWithValidation.mockResolvedValue({
        error: mockErrorResponse,
      });

      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await GET(request);

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalledTimes(1);
      expect(mockGetAccessTokenWithValidation).toHaveBeenCalledTimes(1);
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
      expect(mockHandleApiError).toHaveBeenCalledWith(mockError, 'getting ME profile');
      expect(response).toBe(mockErrorResponse);
    });
  });

  describe('POST /api/user/me', () => {
    it('should successfully create user profile', async () => {
      // Arrange
      const mockFormData = new FormData();
      mockFormData.append('firstName', 'Test');
      mockFormData.append('lastName', 'User');
      mockFormData.append('email', 'test@example.com');

      const request = new NextRequest('http://localhost:3000/api/user/me', {
        method: 'POST',
        body: mockFormData,
      });

      // Act
      const response = await POST(request);
      const responseData = await response.json();

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalledTimes(1);
      expect(mockGetAccessTokenWithValidation).toHaveBeenCalledTimes(1);
      expect(mockCreateUserProfile).toHaveBeenCalledWith(
        mockToken,
        mockApiUrl,
        expect.any(FormData),
      );
      expect(response.status).toBe(201);
      expect(responseData).toEqual({ userId: '12345' });
    });

    it('should handle axios errors', async () => {
      // Arrange
      const mockAxiosError = {
        isAxiosError: true,
        response: { status: 400, data: { message: 'Bad Request' } },
      };
      const mockErrorResponse = NextResponse.json({ error: 'Bad Request' }, { status: 400 });

      mockCreateUserProfile.mockRejectedValue(mockAxiosError);
      mockAxiosIsAxiosError.mockReturnValue(true);
      mockHandleAxiosError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me', {
        method: 'POST',
        body: new FormData(),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(mockCreateUserProfile).toHaveBeenCalledWith(
        mockToken,
        mockApiUrl,
        expect.any(FormData),
      );
      expect(mockAxiosIsAxiosError).toHaveBeenCalledWith(mockAxiosError);
      expect(mockHandleAxiosError).toHaveBeenCalledWith(mockAxiosError, 'create user');
      expect(response).toBe(mockErrorResponse);
    });
  });

  describe('PUT /api/user/me', () => {
    it('should successfully update user profile', async () => {
      // Arrange
      const updateData = {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
      };

      // Override the default mock for this specific test
      mockUpdateUserProfile.mockResolvedValue({
        data: { ...mockUserData, ...updateData },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      const request = new NextRequest('http://localhost:3000/api/user/me', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      // Act
      const response = await PUT(request);
      const responseData = await response.json();

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalledTimes(1);
      expect(mockGetAccessTokenWithValidation).toHaveBeenCalledTimes(1);
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl, updateData);
      expect(response.status).toBe(200);
      expect(responseData).toEqual({ ...mockUserData, ...updateData });
    });

    it('should handle axios errors', async () => {
      // Arrange
      const mockAxiosError = {
        isAxiosError: true,
        response: { status: 404, data: { message: 'User not found' } },
      };
      const mockErrorResponse = NextResponse.json({ error: 'User not found' }, { status: 404 });

      mockUpdateUserProfile.mockRejectedValue(mockAxiosError);
      mockAxiosIsAxiosError.mockReturnValue(true);
      mockHandleAxiosError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me', {
        method: 'PUT',
        body: JSON.stringify({}),
      });

      // Act
      const response = await PUT(request);

      // Assert
      expect(mockUpdateUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl, {});
      expect(mockAxiosIsAxiosError).toHaveBeenCalledWith(mockAxiosError);
      expect(mockHandleAxiosError).toHaveBeenCalledWith(mockAxiosError, 'update user');
      expect(response).toBe(mockErrorResponse);
    });
  });

  describe('DELETE /api/user/me', () => {
    it('should successfully delete user profile', async () => {
      // Arrange
      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await DELETE(request);

      // Assert
      expect(mockValidateBackendUrl).toHaveBeenCalledTimes(1);
      expect(mockGetAccessTokenWithValidation).toHaveBeenCalledTimes(1);
      expect(mockDeleteUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl);
      expect(response.status).toBe(204);

      // For 204 responses, there should be no body to parse
      const text = await response.text();
      expect(text).toBe('');
    });

    it('should handle axios errors', async () => {
      // Arrange
      const mockAxiosError = {
        isAxiosError: true,
        response: { status: 404, data: { message: 'User not found' } },
      };
      const mockErrorResponse = NextResponse.json({ error: 'User not found' }, { status: 404 });

      mockDeleteUserProfile.mockRejectedValue(mockAxiosError);
      mockAxiosIsAxiosError.mockReturnValue(true);
      mockHandleAxiosError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await DELETE(request);

      // Assert
      expect(mockDeleteUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl);
      expect(mockAxiosIsAxiosError).toHaveBeenCalledWith(mockAxiosError);
      expect(mockHandleAxiosError).toHaveBeenCalledWith(mockAxiosError, 'delete user');
      expect(response).toBe(mockErrorResponse);
    });

    it('should handle general API errors', async () => {
      // Arrange
      const mockError = new Error('General Error');
      const mockErrorResponse = NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      );
      mockDeleteUserProfile.mockRejectedValue(mockError);
      mockAxiosIsAxiosError.mockReturnValue(false);
      mockHandleApiError.mockReturnValue(mockErrorResponse);

      const request = new NextRequest('http://localhost:3000/api/user/me');

      // Act
      const response = await DELETE(request);

      // Assert
      expect(mockDeleteUserProfile).toHaveBeenCalledWith(mockToken, mockApiUrl);
      expect(mockHandleApiError).toHaveBeenCalledWith(mockError, 'deleting user');
      expect(response).toBe(mockErrorResponse);
    });
  });
});
