import React from 'react';
import { render, screen, act } from '@testing-library/react';
import NavBar from '@/components/NavBar/NavBar';
import { TestProviders } from '../utils/TestWrapper';

const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

const renderNavBar = () => {
  return render(
    <TestProviders>
      <NavBar />
    </TestProviders>,
  );
};

const createMockMediaQuery = (overrides = {}) => ({
  matches: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  ...overrides,
});

describe('NavBar - Main responsive navigation component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMatchMedia.mockReturnValue(createMockMediaQuery());
  });

  describe('UI Rendering', () => {
    it('Renders without crashing', () => {
      renderNavBar();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('Renders mobile navbar on small screens', () => {
      renderNavBar();
      expect(screen.getByTestId('mobile-navbar')).toBeInTheDocument();
    });

    it('Renders desktop navbar on large screens', () => {
      mockMatchMedia.mockReturnValue(createMockMediaQuery({ matches: true }));

      renderNavBar();
      expect(screen.getByTestId('desktop-navbar')).toBeInTheDocument();
    });
  });

  describe('Media Query Functionality', () => {
    it('Sets up media query listener correctly', () => {
      const mockAddEventListener = jest.fn();
      mockMatchMedia.mockReturnValue(
        createMockMediaQuery({
          matches: true,
          addEventListener: mockAddEventListener,
        }),
      );

      renderNavBar();
      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('Cleans up media query listener on unmount', () => {
      const mockRemoveEventListener = jest.fn();
      mockMatchMedia.mockReturnValue(
        createMockMediaQuery({
          matches: true,
          removeEventListener: mockRemoveEventListener,
        }),
      );

      const { unmount } = renderNavBar();
      unmount();
      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('Updates viewport state on media query change', () => {
      let changeHandler: () => void;
      const mockMediaQuery = {
        matches: false,
        addEventListener: jest.fn((event, handler) => {
          if (event === 'change') changeHandler = handler;
        }),
        removeEventListener: jest.fn(),
      };

      mockMatchMedia.mockReturnValue(mockMediaQuery);

      renderNavBar();
      expect(screen.getByTestId('mobile-navbar')).toBeInTheDocument();

      mockMediaQuery.matches = true;
      act(() => {
        changeHandler!();
      });
      expect(screen.getByTestId('desktop-navbar')).toBeInTheDocument();
    });
  });
});
