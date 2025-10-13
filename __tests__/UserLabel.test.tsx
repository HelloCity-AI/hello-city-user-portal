import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfileCard from '../src/components/UserLabel';

const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (sel: any) => mockUseSelector(sel),
}));

jest.mock('@/store/slices/user', () => ({
  fetchUser: () => ({ type: 'user/fetchUser' }),
}));

function mockReduxState(state: Partial<{ data: any; isLoading: boolean; error: any }> = {}) {
  const defaultState = { data: null, isLoading: false, error: null, ...state };
  mockUseSelector.mockImplementation((selector: any) => selector({ user: defaultState }));
}

const renderUserlabel = (props: any = {}) => render(<UserProfileCard {...props} />);

function expectedFromISOUTC(iso: string) {
  const locale = (typeof navigator !== 'undefined' && (navigator as any).language) || 'en-AU';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(new Date(iso));
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('UserProfileCard (UserLabel) – saga-connected spec', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduxState();
  });

  describe('UX – props render', () => {
    it.skip('Renders incoming props correctly (name/email/avatar/last)', () => {
      const iso = '2023-10-15T14:30:00Z';
      const expected = expectedFromISOUTC(iso);

      renderUserlabel({
        UserName: 'John',
        EmailAddress: 'john@example.com',
        AvatarImg: 'https://example.com/avatar.jpg',
        LastJoinDate: iso,
      });

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();

      const lastNode = screen.getByText(/last login:/i);
      expect(lastNode).toHaveAttribute('title', `last login: ${iso}`);
      expect(lastNode).toHaveTextContent(new RegExp(`last login:\\s*${escapeRegExp(expected)}`));

      const img = screen.getByAltText('User Avatar') as HTMLImageElement;
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it.skip('Shows defaults when props missing', () => {
      renderUserlabel({
        UserName: undefined,
        EmailAddress: undefined,
        AvatarImg: undefined,
        LastJoinDate: undefined,
      });

      expect(screen.getByText('Unknown User')).toBeInTheDocument();
      expect(screen.getByText('Unknown Email')).toBeInTheDocument();
      expect(screen.getByText(/last login:\s*Unknown/i)).toBeInTheDocument();

      const placeholder = screen.getByText('account_circle');
      expect(placeholder).toBeInTheDocument();
      expect(placeholder).toHaveClass('material-icons');
      expect(screen.queryByAltText('User Avatar')).not.toBeInTheDocument();
    });
  });

  describe('UI – classes', () => {
    it('Applies key style classes to main blocks', () => {
      const { container } = renderUserlabel({
        UserName: 'John',
        EmailAddress: 'john@example.com',
        AvatarImg: 'https://example.com/avatar.jpg',
        LastJoinDate: '2023-10-15T14:30:00Z',
      });

      expect(container.firstChild).toHaveClass('rounded-2xl');

      const avatarBox = screen.getByTestId('avatar-container');
      expect(avatarBox).toHaveClass('rounded-full');
      expect(avatarBox).toHaveClass('border-4', 'border-white');
      expect(avatarBox).toHaveClass('h-20', 'w-20');
      expect(avatarBox).toHaveClass('sm:h-24', 'sm:w-24', 'md:h-28', 'md:w-28');

      expect(screen.getByText('John')).toHaveClass('text-xl', 'font-bold');
      expect(screen.getByText('john@example.com')).toHaveClass('text-gray-500');
    });
  });

  describe('Overflow & Tooltip', () => {
    it.skip('Default: single-line truncate + tooltip titles present', () => {
      const long = 'A'.repeat(200);
      renderUserlabel({
        UserName: long,
        EmailAddress: `${long}@example.com`,
        LastJoinDate: '2023-10-15T14:30:00Z',
      });

      const nameEl = screen.getByText(long);
      expect(nameEl).toHaveClass('truncate');
      expect(nameEl).toHaveAttribute('title', long);

      const emailEl = screen.getByText(`${long}@example.com`);
      expect(emailEl).toHaveClass('truncate');
      expect(emailEl).toHaveAttribute('title', `${long}@example.com`);

      const lastEl = screen.getByText(/last login:/i);
      expect(lastEl).toHaveClass('truncate');

      const textContainer = document.querySelector('div.flex-1');
      expect(textContainer).toHaveClass('min-w-0', 'overflow-hidden');
    });

    it.skip('Wrap=true: break-words + no truncate; showTooltip=false removes title', () => {
      const long = 'B'.repeat(200);
      renderUserlabel({
        UserName: long,
        EmailAddress: `${long}@example.com`,
        LastJoinDate: '2023-10-15T14:30:00Z',
        wrap: true,
        showTooltip: false,
      });

      const nameEl = screen.getByText(long);
      expect(nameEl).toHaveClass('break-words');
      expect(nameEl).not.toHaveClass('truncate');
      expect(nameEl).not.toHaveAttribute('title');

      const emailEl = screen.getByText(`${long}@example.com`);
      expect(emailEl).toHaveClass('break-words');
      expect(emailEl).not.toHaveClass('truncate');
      expect(emailEl).not.toHaveAttribute('title');

      const lastEl = screen.getByText(/last login:/i);
      expect(lastEl).toHaveClass('break-words');
      expect(lastEl).not.toHaveClass('truncate');
      expect(lastEl).not.toHaveAttribute('title');
    });
  });

  describe('Saga wiring', () => {
    it('AutoFetch: dispatches fetchUser when no props, no store data, and not loading', () => {
      mockReduxState({ data: null, isLoading: false, error: null });
      renderUserlabel({ autoFetch: true });

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'user/fetchUser' });
    });

    it('Does NOT autoFetch when props provided', () => {
      mockReduxState({ data: null, isLoading: false, error: null });
      renderUserlabel({ UserName: 'X' });

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('Shows Skeleton when loading and no props', () => {
      mockReduxState({ data: null, isLoading: true, error: null });
      const { container } = renderUserlabel({});
      expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
      expect(screen.queryByAltText('User Avatar')).not.toBeInTheDocument();
    });

    it('Error subtitle adds "load error"', () => {
      mockReduxState({ data: null, isLoading: false, error: 'boom' });
      renderUserlabel({ EmailAddress: 'xx@example.com' });

      expect(screen.getByText(/xx@example\.com\s+•\s+load error/)).toBeInTheDocument();
    });
  });

  describe('Store vs Props precedence', () => {
    it('Uses store data when props missing', () => {
      mockReduxState({
        data: {
          username: 'Alice',
          email: 'alice@example.com',
          avatarUrl: 'https://a/avatar.png',
          lastJoinDate: '2024-01-01T00:00:00Z',
        },
      });

      renderUserlabel({});
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      const img = screen.getByAltText('User Avatar') as HTMLImageElement;
      expect(img).toHaveAttribute('src', 'https://a/avatar.png');
    });

    it('Props override store data', () => {
      mockReduxState({
        data: {
          username: 'Alice',
          email: 'alice@example.com',
        },
      });

      renderUserlabel({ UserName: 'Bob', EmailAddress: 'bob@x.com' });
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('bob@x.com')).toBeInTheDocument();
    });
  });
});
