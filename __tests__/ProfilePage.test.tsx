import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfilePage from '../src/app/[lang]/profile/page';

jest.mock('../src/components/ProfileSideBar', () => {
  return function MockProfileSideBar() {
    return <div data-testid="profile-sidebar">Profile Sidebar</div>;
  };
});

jest.mock('../src/api/userApi', () => ({
  updateUser: jest.fn(),
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
    render(<ProfilePage />);
    
    expect(screen.getByTestId('trans-profile.title')).toBeInTheDocument();
    expect(screen.getByTestId('trans-profile.subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('trans-profile.personal-info')).toBeInTheDocument();
  });

  test('renders all form fields with default labels', () => {
    render(<ProfilePage />);
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Nationality')).toBeInTheDocument();
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument(); // Gender is in a select field
    expect(screen.getByLabelText('University')).toBeInTheDocument();
    expect(screen.getByLabelText('Major')).toBeInTheDocument();
    expect(screen.getByLabelText('Preferred Language')).toBeInTheDocument();
  });

  test('renders submit button with translation', () => {
    render(<ProfilePage />);
    
    expect(screen.getByTestId('trans-profile.submit')).toBeInTheDocument();
  });
});