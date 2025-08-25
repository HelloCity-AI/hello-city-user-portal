import { screen } from '@testing-library/react';
import { renderWithThemeAndI18n } from '../utils/renderWithProviders';
import { devices } from '../utils/DeviceConfig';
import CreateUserProfilePage from '@/app/[lang]/create-user-profile/page';

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

describe('CreateUserProfile - Device Compatibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  Object.values(devices).forEach((device) => {
    test(`Should work properly on ${device.name} (${device.width}x${device.height})`, () => {
      setViewportSize(device.width, device.height);
      renderWithThemeAndI18n(<CreateUserProfilePage />);

      expect(screen.getByText('Hello City')).toBeVisible();
      expect(screen.getByLabelText(/gender/i)).toBeVisible();
      expect(screen.getByLabelText(/nationality/i)).toBeVisible();
      expect(screen.getByLabelText(/city/i)).toBeVisible();
      expect(screen.getByLabelText(/language/i)).toBeVisible();
      expect(screen.getByRole('button', { name: /I'm all set/i })).toBeVisible();

      expect(screen.getByLabelText(/gender/i)).toBeEnabled();
      expect(screen.getByRole('button', { name: /I'm all set/i })).toBeEnabled();
    });
  });

  describe('Edge Cases', () => {
    test('Should work on very small screens', () => {
      setViewportSize(320, 480);
      renderWithThemeAndI18n(<CreateUserProfilePage />);

      expect(screen.getByText('Hello City')).toBeVisible();
      expect(screen.getByLabelText(/gender/i)).toBeVisible();
      expect(screen.getByRole('button', { name: /I'm all set/i })).toBeVisible();
    });

    test('Should work on very large screens', () => {
      setViewportSize(1920, 1080);
      renderWithThemeAndI18n(<CreateUserProfilePage />);

      expect(screen.getByText('Hello City')).toBeVisible();
      expect(screen.getByLabelText(/gender/i)).toBeVisible();
      expect(screen.getByRole('button', { name: /I'm all set/i })).toBeVisible();
    });

    test('Should handle landscape orientation on mobile', () => {
      setViewportSize(667, 375);
      renderWithThemeAndI18n(<CreateUserProfilePage />);

      expect(screen.getByText('Hello City')).toBeVisible();
      expect(screen.getByLabelText(/gender/i)).toBeVisible();
    });
  });
});
