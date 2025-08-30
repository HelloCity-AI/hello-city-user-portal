import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import DesktopNavBar from '@/components/NavBar/DesktopNavBar';
import { TestProviders } from '../utils/TestWrapper';
import { mockNavConfig } from './mockData';

const renderDesktopNavBar = (props = {}) => {
  const defaultProps = {
    navConfig: mockNavConfig,
    hasSignedIn: false,
    ...props,
  };

  return render(
    <TestProviders>
      <DesktopNavBar {...defaultProps} />
    </TestProviders>,
  );
};

const scrollToPosition = (position: number) => {
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    value: position,
  });
  fireEvent.scroll(window);
};

describe('DesktopNavBar - Desktop navigation with scroll effects', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('UI Rendering', () => {
    it('Renders without crashing', () => {
      renderDesktopNavBar();
      expect(screen.getByTestId('desktop-navbar')).toBeInTheDocument();
    });

    it('Shows transparent background initially', () => {
      renderDesktopNavBar();

      const navbar = screen.getByTestId('desktop-navbar');
      expect(navbar).toHaveClass('bg-transparent');
    });

    it('Shows light logo when transparent background', () => {
      renderDesktopNavBar();

      const logo = screen.getByAltText('HelloCity Logo');
      expect(logo).toHaveAttribute('src', expect.stringContaining('Logo.png'));
    });

    it('Renders navigation links correctly', () => {
      renderDesktopNavBar();

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Chat')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('Renders language dropdown with correct options', () => {
      renderDesktopNavBar();

      const languageButton = screen.getByLabelText('Change language');
      expect(languageButton).toBeInTheDocument();
      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('Handles language options without onClick handlers', () => {
      renderDesktopNavBar();

      const languageButton = screen.getByLabelText('Change language');
      expect(languageButton).toBeInTheDocument();

      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('Shows user dropdown when signed in', () => {
      renderDesktopNavBar({ hasSignedIn: true });

      expect(screen.getByLabelText('User menu')).toBeInTheDocument();
      expect(screen.getByAltText('User Avatar')).toBeInTheDocument();
    });

    it('Shows sign in button when not signed in', () => {
      renderDesktopNavBar({ hasSignedIn: false });

      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });

    it('Shows Try HelloCity button', () => {
      renderDesktopNavBar();

      expect(screen.getByText('Try HelloCity')).toBeInTheDocument();
    });
  });

  describe('Timer Management', () => {
    it('Cleans up timer on unmount', () => {
      jest.useFakeTimers();
      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');

      const { unmount } = renderDesktopNavBar();

      act(() => {
        scrollToPosition(31);
      });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
      jest.useRealTimers();
    });
  });

  describe('Scroll Effects', () => {
    it('Changes background on scroll past threshold', async () => {
      renderDesktopNavBar();

      act(() => {
        scrollToPosition(31);
        jest.advanceTimersByTime(20);
      });

      await waitFor(() => {
        const navbar = screen.getByTestId('desktop-navbar');
        expect(navbar).toHaveClass('bg-white/90');
      });
    });

    it('Does not change background when below threshold', async () => {
      renderDesktopNavBar();

      act(() => {
        scrollToPosition(29);
        jest.advanceTimersByTime(20);
      });

      await waitFor(() => {
        const navbar = screen.getByTestId('desktop-navbar');
        expect(navbar).toHaveClass('bg-transparent');
      });
    });

    it('Changes logo from light to dark on scroll', async () => {
      renderDesktopNavBar();

      act(() => {
        scrollToPosition(31);
        jest.advanceTimersByTime(20);
      });

      await waitFor(() => {
        const logo = screen.getByAltText('HelloCity Logo');
        expect(logo).toHaveAttribute('src', expect.stringContaining('logo-dark.png'));
      });
    });

    it('Updates styling on scroll', async () => {
      renderDesktopNavBar();

      act(() => {
        scrollToPosition(31);
        jest.advanceTimersByTime(20);
      });

      await waitFor(() => {
        const navbar = screen.getByTestId('desktop-navbar');
        expect(navbar).toHaveClass('bg-white/90');
      });
    });

    it('Throttles scroll events correctly', async () => {
      renderDesktopNavBar();

      act(() => {
        scrollToPosition(31);
        scrollToPosition(35);
        scrollToPosition(40);
      });

      act(() => {
        jest.advanceTimersByTime(10);
      });

      const navbar = screen.getByTestId('desktop-navbar');
      expect(navbar).toHaveClass('bg-transparent');

      act(() => {
        jest.advanceTimersByTime(10);
      });

      await waitFor(() => {
        expect(navbar).toHaveClass('bg-white/90');
      });
    });

    it('Cleans up scroll listener on unmount', () => {
      const removeEventListener = jest.fn();
      window.removeEventListener = removeEventListener;

      const { unmount } = renderDesktopNavBar();

      unmount();
      expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });
});
