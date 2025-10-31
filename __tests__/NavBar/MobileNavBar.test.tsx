import React, { createElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileNavBar from '@/compoundComponents/NavBar/MobileNavBar';
import { TestProviders } from '../utils/TestWrapper';
import { mockNavConfig } from './mockData';

// Make MUI Drawer synchronous to avoid transition-related flakiness in jsdom
jest.mock('@mui/material/Drawer', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockDrawer = ({ open, children, ...rest }: any) =>
    open ? createElement('div', { role: 'presentation', ...rest }, children) : null;
  MockDrawer.displayName = 'MockMuiDrawer';
  return MockDrawer;
});

// Local mock for next/image to avoid passing unsupported boolean props (e.g., fill) to DOM
jest.mock('next/image', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MockNextImage = ({ src, alt, width, height, sizes }: any) => {
    const resolvedSrc = typeof src === 'string' ? src : (src?.src ?? '');
    return createElement('img', { src: resolvedSrc, alt, width, height, sizes });
  };
  MockNextImage.displayName = 'MockNextImage';
  return MockNextImage;
});

const renderMobileNavBar = (props = {}) => {
  const defaultProps = {
    navConfig: mockNavConfig,
    hasAuthenticated: false,
    ...props,
  };

  return render(
    <TestProviders>
      <MobileNavBar {...defaultProps} />
    </TestProviders>,
  );
};

const clickHamburgerMenu = () => {
  const hamburgerButton = screen.getByLabelText('Open menu');
  fireEvent.click(hamburgerButton);
  return hamburgerButton;
};

const clickCloseMenu = () => {
  const closeButton = screen.getByLabelText('Close menu');
  fireEvent.click(closeButton);
  return closeButton;
};

describe('MobileNavBar - Mobile navigation with drawer functionality', () => {
  describe('UI Rendering', () => {
    it('Renders without crashing', () => {
      renderMobileNavBar();
      expect(screen.getByTestId('mobile-navbar')).toBeInTheDocument();
    });

    it('Shows logo when no submenu active', () => {
      renderMobileNavBar();
      expect(screen.getByAltText('HelloCity Logo')).toBeInTheDocument();
    });

    it('Renders sign in button when not signed in', () => {
      renderMobileNavBar({ hasAuthenticated: false });
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('Renders user avatar when signed in', () => {
      renderMobileNavBar({ hasAuthenticated: true });
      // Avatar trigger is labeled; alt text may not exist if no image src
      expect(screen.getByLabelText('User menu')).toBeInTheDocument();
    });
  });

  describe('Drawer Functionality', () => {
    it('Toggles hamburger menu icon state correctly', () => {
      renderMobileNavBar();

      const hamburgerButton = screen.getByLabelText('Open menu');
      expect(hamburgerButton).toBeInTheDocument();

      clickHamburgerMenu();
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    });

    it('Opens nav drawer when hamburger clicked', () => {
      renderMobileNavBar();
      clickHamburgerMenu();

      expect(screen.getByText('Try HelloCity', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('Opens user drawer when avatar clicked (signed in)', () => {
      renderMobileNavBar({ hasAuthenticated: true });

      const userButton = screen.getByLabelText('User menu');
      fireEvent.click(userButton);

      expect(screen.getByText('Leon')).toBeInTheDocument();
    });

    it('Closes user drawer when already open and clicked again', () => {
      renderMobileNavBar({ hasAuthenticated: true });

      const userAvatar = screen.getByLabelText('User menu');

      fireEvent.click(userAvatar);
      expect(screen.getByText('Leon')).toBeInTheDocument();

      fireEvent.click(userAvatar);
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    });

    it('Calls closeDrawerMenu function when close button clicked', () => {
      renderMobileNavBar();

      clickHamburgerMenu();
      expect(screen.getByText('Try HelloCity', { exact: false })).toBeInTheDocument();

      clickCloseMenu();
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });

    it('Resets submenu index when closeDrawerMenu called from submenu', () => {
      renderMobileNavBar();

      clickHamburgerMenu();
      const servicesItem = screen.getByText('Services');
      fireEvent.click(servicesItem);

      expect(screen.getByText('Web Dev')).toBeInTheDocument();

      clickCloseMenu();
      expect(screen.queryByRole('presentation')).not.toBeInTheDocument();

      clickHamburgerMenu();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.queryByText('Web Dev')).not.toBeInTheDocument();
    });

    // Simplified to avoid async flakiness with transitions
    it('Closes user drawer when toggled via avatar', () => {
      renderMobileNavBar({ hasAuthenticated: true });
      const userAvatar = screen.getByLabelText('User menu');
      fireEvent.click(userAvatar);
      expect(screen.getByText('Leon')).toBeInTheDocument();
      fireEvent.click(userAvatar);
      expect(screen.queryByText('Leon')).not.toBeInTheDocument();
    });
  });

  describe('Navigation Functionality', () => {
    it('Updates nav drawer menu when submenu index changes', () => {
      renderMobileNavBar();
      clickHamburgerMenu();

      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.queryByText('Web Dev')).not.toBeInTheDocument();

      const servicesItem = screen.getByText('Services');
      fireEvent.click(servicesItem);

      expect(screen.getByText('Web Dev')).toBeInTheDocument();
      expect(screen.getByText('Mobile Dev')).toBeInTheDocument();
    });

    it('Shows back button when submenu active', () => {
      renderMobileNavBar();
      clickHamburgerMenu();

      const servicesItem = screen.getByText('Services');
      fireEvent.click(servicesItem);

      expect(screen.getByText('← Back')).toBeInTheDocument();
    });

    it('Returns to main menu when back button clicked', () => {
      renderMobileNavBar();
      clickHamburgerMenu();

      const servicesItem = screen.getByText('Services');
      fireEvent.click(servicesItem);

      expect(screen.getByText('Web Dev')).toBeInTheDocument();

      const backButton = screen.getByText('← Back');
      fireEvent.click(backButton);

      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.queryByText('Web Dev')).not.toBeInTheDocument();

      expect(screen.getByText('Try HelloCity', { exact: false })).toBeInTheDocument();
    });
  });
});
