import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfileCard from '../src/components/UserLabel';

type ImageProps = {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
};

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: ImageProps) => (
    <img
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      className={props.className}
    />
  ),
}));

const mockUserData = {
  UserName: 'John',
  PreferredName: 'nikeJohn',
  Avatar: 'https://example.com/avatar.jpg',
  LastJoinDate: '2023-10-15 14:30',
};

const renderUserlabel = (props = {}) => {
  return render(<UserProfileCard {...props} />);
};

describe('UserLabel component test', () => {
  describe('UX Design', () => {
    it('Correctly render incoming user data', () => {
      renderUserlabel(mockUserData);

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('@nikeJohn')).toBeInTheDocument();
      expect(screen.getByText(/last login: 2023-10-15 14:30/i)).toBeInTheDocument();
      expect(screen.getByAltText('User Avatar')).toHaveAttribute(
        'src',
        'https://example.com/avatar.jpg',
      );
    });

    it('When missing some data, show default values', () => {
      renderUserlabel({
        UserName: undefined,
        PreferredName: undefined,
        Avatar: undefined,
        LastJoinDate: undefined,
      });

      expect(screen.getByText('Unknown User')).toBeInTheDocument();
      expect(screen.getByText('@UnknownNickname')).toBeInTheDocument();
      expect(screen.getByText(/last login: unknown/i)).toBeInTheDocument();
      expect(screen.queryByText('John')).not.toBeInTheDocument();
      expect(screen.queryByText('@nikeJohn')).not.toBeInTheDocument();
      expect(screen.queryByText(/last login: 2023-10-15 14:30/i)).not.toBeInTheDocument();
      expect(screen.getByText('account_circle')).toHaveClass(
        'material-icons text-7xl text-gray-400',
      );
      expect(screen.queryByAltText('User Avatar')).not.toBeInTheDocument();
    });
  });
  describe('UI Design', () => {
    it('Applies the correct style classes', () => {
      const { container } = renderUserlabel(mockUserData);

      expect(container.firstChild).toHaveClass(
        'bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl',
      );
      expect(screen.getByTestId('avatar-container')).toHaveClass(
        'w-20 h-20 rounded-full border-4 border-white',
      );
      expect(screen.getByText('John')).toHaveClass('text-xl font-bold');
      expect(screen.getByText('@nikeJohn')).toHaveClass('text-indigo-200');
    });

    it('Displays the time icon', () => {
      renderUserlabel(mockUserData);
      expect(screen.getByText('access_time')).toHaveClass(
        'material-icons text-base text-indigo-200',
      );
    });

    it('When avatar is provided, uses the correct size', () => {
      renderUserlabel(mockUserData);

      const avatar = screen.getByAltText('User Avatar');

      expect(avatar).toHaveAttribute('width', '64');
      expect(avatar).toHaveAttribute('height', '64');
    });
  });
});
