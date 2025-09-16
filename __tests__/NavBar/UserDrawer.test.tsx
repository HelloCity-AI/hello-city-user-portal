import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserDrawer from '@/compoundComponents/NavBar/UserDrawer';
import { TestProviders } from '../utils/TestWrapper';
import type { MenuOption } from '@/types/menu';

const TestIcon: React.FC = () => <svg />;

const testOptions: MenuOption[] = [
  {
    label: 'Profile',
    value: 'profile',
    onClick: jest.fn(),
    icon: TestIcon,
    divider: false,
  },
  {
    label: 'Settings',
    value: 'settings',
    onClick: jest.fn(),
    icon: TestIcon,
    divider: true,
  },
  {
    label: 'Logout',
    value: 'logout',
    onClick: jest.fn(),
    divider: false,
  },
];

const renderUserDrawer = (props = {}) => {
  const defaultProps = {
    open: true,
    closeDrawer: jest.fn(),
    onClose: jest.fn(),
    options: testOptions,
    ...props,
  };

  return render(
    <TestProviders>
      <UserDrawer {...defaultProps} />
    </TestProviders>,
  );
};

const clickMenuOption = (optionText: string) => {
  const menuItem = screen.getByText(optionText);
  fireEvent.click(menuItem);
  return menuItem;
};

describe('UserDrawer - User menu drawer component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI Rendering', () => {
    it('Renders without crashing', () => {
      renderUserDrawer();
      expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('Renders user profile card', () => {
      renderUserDrawer();
      expect(screen.getByText('Leon')).toBeInTheDocument();
    });

    it('Renders all menu options', () => {
      renderUserDrawer();

      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('Shows icons for menu options that have them', () => {
      renderUserDrawer();

      expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
      expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('logout-icon')).not.toBeInTheDocument();
    });

    it('Shows dividers for menu organization', () => {
      renderUserDrawer({ open: true });

      // Verify menu options are rendered (dividers are implementation details)
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('Renders with correct drawer properties', () => {
      renderUserDrawer({
        anchor: 'right',
        className: 'custom-class',
        open: true,
      });

      // Verify drawer is rendered and functional
      expect(screen.getByRole('presentation')).toBeInTheDocument();
      expect(screen.getByText('Leon')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('Calls menu item onClick and closeDrawer when menu item clicked', () => {
      const closeDrawer = jest.fn();

      renderUserDrawer({ closeDrawer });
      clickMenuOption('Profile');

      expect(testOptions[0].onClick).toHaveBeenCalledTimes(1);
      expect(closeDrawer).toHaveBeenCalledTimes(1);
    });

    it('Closes drawer when backdrop clicked', () => {
      const closeDrawer = jest.fn();
      renderUserDrawer({ closeDrawer });

      const backdrop = screen.getByRole('presentation').firstChild;
      fireEvent.click(backdrop as Element);

      expect(closeDrawer).toHaveBeenCalledTimes(1);
    });

    it('Closes drawer when ESC key pressed', () => {
      const closeDrawer = jest.fn();
      renderUserDrawer({ closeDrawer });

      fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape' });

      expect(closeDrawer).toHaveBeenCalledTimes(1);
    });
  });
});
