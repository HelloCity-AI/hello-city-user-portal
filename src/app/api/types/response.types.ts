import type { AxiosResponse } from 'axios';
import type { User } from '@/types/User.types';

// API Response types for user profile endpoints
export type UserProfileResponse = AxiosResponse<User | null>;

// Error response types
export type ApiErrorResponse = {
  error: string;
  code?: string;
  details?: string;
};

// Generic API response wrapper
export type ApiResponse<T = unknown> = AxiosResponse<T>;
