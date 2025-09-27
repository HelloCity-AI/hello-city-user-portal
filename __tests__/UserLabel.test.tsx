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

const mockUserData = {
  UserName: 'John',
  EmailAdress: 'john@example.com',
  AvatarImg: 'https://example.com/avatar.jpg',
  LastJoinDate: '2023-10-15 14:30',
};

const renderUserlabel = (props = {}) => render(<UserProfileCard {...props} />);

describe('UserProfileCard (UserLabel) – new spec', () => {
  describe('UX Design', () => {
    it('Renders incoming user data correctly', () => {
      renderUserlabel(mockUserData);

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('@john@example.com')).toBeInTheDocument();
      expect(screen.getByText(/last login: 2023-10-15 14:30/i)).toBeInTheDocument();

      const img = screen.getByAltText('User Avatar') as HTMLImageElement;
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('Shows defaults when some data is missing', () => {
      renderUserlabel({
        UserName: undefined,
        EmailAdress: undefined,
        AvatarImg: undefined,
        LastJoinDate: undefined,
      });

      expect(screen.getByText('Unknown User')).toBeInTheDocument();
      expect(screen.getByText('@Unknown Email')).toBeInTheDocument();
      expect(screen.getByText(/last login: unknown/i)).toBeInTheDocument();

      const placeholder = screen.getByText('account_circle');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveClass('material-icons');
      expect(screen.queryByAltText('User Avatar')).not.toBeInTheDocument();
    });
  });

  describe('UI Design', () => {
    it('Applies key style classes to main blocks', () => {
      const { container } = renderUserlabel(mockUserData);
      expect(container.firstChild).toHaveClass('rounded-2xl');

      const avatarBox = screen.getByTestId('avatar-container');
      expect(avatarBox).toHaveClass('rounded-full');
      expect(avatarBox).toHaveClass('border-4', 'border-white');
      expect(avatarBox).toHaveClass('h-20', 'w-20');
      expect(avatarBox).toHaveClass('sm:h-24', 'sm:w-24', 'md:h-28', 'md:w-28');
      expect(screen.getByText('John')).toHaveClass('text-xl', 'font-bold');
      expect(screen.getByText('@john@example.com')).toHaveClass('text-gray-500');
    });
  });

  describe('Overflow & Tooltip behavior', () => {
    it('Default: single-line truncate + tooltip titles are present', () => {
      const long = 'A'.repeat(200);
      renderUserlabel({
        UserName: long,
        EmailAdress: `${long}@example.com`,
        LastJoinDate: long,
      });

      const nameEl = screen.getByText(long);
      expect(nameEl).toHaveClass('truncate');
      expect(nameEl).toHaveAttribute('title', long);

      const emailEl = screen.getByText(`@${long}@example.com`);
      expect(emailEl).toHaveClass('truncate');
      expect(emailEl).toHaveAttribute('title', `@${long}@example.com`);

      const lastText = screen.getByText(new RegExp(`last login: ${long}`));
      expect(lastText).toHaveClass('truncate');

      const textContainer = document.querySelector('div.flex-1');
      expect(textContainer).toHaveClass('min-w-0', 'overflow-hidden');
    });

    it('Wrap=true: switches to break-words and disables truncate; showTooltip=false removes title', () => {
      const long = 'B'.repeat(200);
      renderUserlabel({
        UserName: long,
        EmailAdress: `${long}@example.com`,
        LastJoinDate: long,
        wrap: true,
        showTooltip: false,
      });

      const nameEl = screen.getByText(long);
      expect(nameEl).toHaveClass('break-words');
      expect(nameEl).not.toHaveClass('truncate');
      expect(nameEl).not.toHaveAttribute('title');

      const emailEl = screen.getByText(`@${long}@example.com`);
      expect(emailEl).toHaveClass('break-words');
      expect(emailEl).not.toHaveClass('truncate');
      expect(emailEl).not.toHaveAttribute('title');

      const lastText = screen.getByText(new RegExp(`last login: ${long}`));
      expect(lastText).toHaveClass('break-words');
      expect(lastText).not.toHaveClass('truncate');
      expect(lastText).not.toHaveAttribute('title');
    });
  });
});
