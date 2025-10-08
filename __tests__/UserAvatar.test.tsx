import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserAvatar from '@/compoundComponents/UserAvatar';
import type { User } from '@/types/User.types';
import type { UserState } from '@/store/slices/user';
import { AuthState } from '@/store/slices/user';

// Create test theme
const testTheme = createTheme();

// Mock user data
const mockUserWithAvatar: User = {
  userId: '123',
  email: 'test@example.com',
  avatarFile: '/images/default-avatar.jpg',
  gender: '',
  nationality: '',
  city: '',
  university: '',
  major: '',
  preferredLanguage: '',
  lastJoinDate: new Date(),
};

const mockUserWithoutAvatar: User = {
  userId: '456',
  email: 'noavatar@example.com',
  avatarFile: '',
  gender: '',
  nationality: '',
  city: '',
  university: '',
  major: '',
  preferredLanguage: '',
  lastJoinDate: new Date(),
};

// Mock store creator
const createMockStore = (userData: User | null) => {
  const userState: UserState = {
    isLoading: false,
    data: userData,
    error: null,
    authStatus: userData ? AuthState.AuthenticatedWithProfile : AuthState.Unauthenticated,
  };

  return configureStore({
    reducer: {
      user: () => userState,
    },
  });
};

// Test wrapper component
const renderWithProviders = (ui: React.ReactElement, userData: User | null = null) => {
  const store = createMockStore(userData);

  return render(
    <Provider store={store}>
      <ThemeProvider theme={testTheme}>{ui}</ThemeProvider>
    </Provider>,
  );
};

describe('UserAvatar', () => {
  it('renders avatar with image when user has avatar', () => {
    renderWithProviders(<UserAvatar />, mockUserWithAvatar);

    const avatar = screen.getByRole('img', { name: 'User Avatar' });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockUserWithAvatar.avatarFile);
  });

  it('renders avatar with email initial when user has no avatar', () => {
    renderWithProviders(<UserAvatar />, mockUserWithoutAvatar);

    const avatar = screen.getByText('N');
    expect(avatar).toBeInTheDocument();
  });

  it('renders with default size when no size prop provided', () => {
    renderWithProviders(<UserAvatar />, mockUserWithAvatar);

    const avatarContainer = screen.getByRole('img', { name: 'User Avatar' }).parentElement;
    expect(avatarContainer).toHaveStyle({ width: '2rem', height: '2rem' });
  });

  it('renders with custom size when size prop provided', () => {
    const customSize = '3rem';
    renderWithProviders(<UserAvatar size={customSize} />, mockUserWithAvatar);

    const avatarContainer = screen.getByRole('img', { name: 'User Avatar' }).parentElement;
    expect(avatarContainer).toHaveStyle({ width: '3rem', height: '3rem' });
  });

  it('renders with string size value', () => {
    const customSize = '4rem';
    renderWithProviders(<UserAvatar size={customSize} />, mockUserWithAvatar);

    const avatarContainer = screen.getByRole('img', { name: 'User Avatar' }).parentElement;
    expect(avatarContainer).toHaveStyle({ width: '4rem', height: '4rem' });
  });

  it('has cursor pointer style', () => {
    renderWithProviders(<UserAvatar />, mockUserWithAvatar);

    const avatarContainer = screen.getByRole('img', { name: 'User Avatar' }).parentElement;
    expect(avatarContainer).toHaveStyle({ cursor: 'pointer' });
  });

  it('passes through additional avatar props', () => {
    renderWithProviders(
      <UserAvatar data-testid="custom-avatar" className="custom-class" />,
      mockUserWithAvatar,
    );

    const avatar = screen.getByTestId('custom-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass('custom-class');
  });

  it('renders empty when no user data', () => {
    renderWithProviders(<UserAvatar data-testid="user-avatar-empty" />, null);

    // When no user data, Avatar should still render but without an <img> element
    const avatarContainer = screen.getByTestId('user-avatar-empty');
    expect(avatarContainer).toBeInTheDocument();
    expect(avatarContainer.querySelector('img')).not.toBeInTheDocument();
  });
});
