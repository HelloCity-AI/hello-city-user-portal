import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProfilePage from '../src/app/[lang]/profile/page';
import { defaultUser } from '../src/types/User.types';

// Create a mock store
const mockStore = configureStore({
  reducer: {
    user: () => ({
      data: defaultUser,
      isLoading: false,
      error: null,
    }),
  },
});

const MockedProfilePage = () => (
  <Provider store={mockStore}>
    <ProfilePage />
  </Provider>
);

jest.mock('../src/components/ProfileSideBar', () => {
  return function MockProfileSideBar() {
    return <div data-testid="profile-sidebar">Profile Sidebar</div>;
  };
});

jest.mock('../src/api/userApi', () => ({
  updateUser: jest.fn(),
}));

jest.mock('../src/store/slices/user', () => ({
  fetchUser: jest.fn(),
}));

jest.mock('@lingui/react', () => ({
  Trans: ({ id }: { id: string }) => <span data-testid={`trans-${id}`}>{id}</span>,
  useLingui: () => ({
    i18n: {
      _: (key: string, options?: { default?: string }) => options?.default || key,
      on: jest.fn(),
      removeListener: jest.fn(),
    },
  }),
}));

describe('Profile Page', () => {
  test('renders profile form with translation keys', () => {
    render(<MockedProfilePage />);

    expect(screen.getByTestId('trans-profile.title')).toBeInTheDocument();
    expect(screen.getByTestId('trans-profile.subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('trans-profile.personal-info')).toBeInTheDocument();
  });

  test('renders all form fields with default labels', () => {
    render(<MockedProfilePage />);

    // Check for display values (not form fields since edit modal is closed by default)
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Nationality')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('University')).toBeInTheDocument();
    expect(screen.getByText('Major')).toBeInTheDocument();
    expect(screen.getByText('Preferred Language')).toBeInTheDocument();
  });

  test('renders edit button with translation', () => {
    render(<MockedProfilePage />);

    expect(screen.getByTestId('trans-profile.edit-button')).toBeInTheDocument();
  });
});
