import React from 'react';
import { render, screen, act } from '@testing-library/react';
import NavBar from '@/components/NavBar/NavBar';
import { TestProviders } from '../utils/TestWrapper';
import { devices } from '../utils/DeviceConfig';

const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

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
      setViewportSize(devices.mobile.width, devices.mobile.height);
      renderNavBar();
      expect(screen.getByTestId('mobile-navbar')).toBeInTheDocument();
    });

    it('Renders desktop navbar on large screens', () => {
      setViewportSize(devices.desktop.width, devices.desktop.height);
      mockMatchMedia.mockReturnValue(createMockMediaQuery({ matches: true }));

      renderNavBar();
      expect(screen.getByTestId('desktop-navbar')).toBeInTheDocument();
    });
  });

  describe('Device Compatibility', () => {
    Object.values(devices).forEach((device) => {
      test(`Should work properly on ${device.name} (${device.width}x${device.height})`, () => {
        setViewportSize(device.width, device.height);

        if (device.width >= 1024) {
          mockMatchMedia.mockReturnValue(createMockMediaQuery({ matches: true }));
        } else {
          mockMatchMedia.mockReturnValue(createMockMediaQuery({ matches: false }));
        }

        renderNavBar();

        expect(screen.getByRole('navigation')).toBeInTheDocument();

        if (device.width >= 1024) {
          expect(screen.getByTestId('desktop-navbar')).toBeInTheDocument();
        } else {
          expect(screen.getByTestId('mobile-navbar')).toBeInTheDocument();
        }
      });
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
      setViewportSize(devices.mobile.width, devices.mobile.height);

      renderNavBar();
      expect(screen.getByTestId('mobile-navbar')).toBeInTheDocument();

      setViewportSize(devices.desktop.width, devices.desktop.height);
      mockMediaQuery.matches = true;
      act(() => {
        changeHandler!();
      });
      expect(screen.getByTestId('desktop-navbar')).toBeInTheDocument();
    });
  });
});
