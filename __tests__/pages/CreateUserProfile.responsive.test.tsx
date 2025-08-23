import { screen } from '@testing-library/react';
import { renderWithThemeAndI18n } from '../utils/renderWithProviders';
import CreateUserProfilePage from '@/app/[lang]/create-user-profile/page';

describe('CreateUserProfile - Device Compatibility', () => {
  const devices = {
    mobile: { width: 375, height: 667, name: 'Mobile' },
    tablet: { width: 768, height: 1024, name: 'Tablet' },
    desktop: { width: 1024, height: 768, name: 'Desktop' },
    largeDesktop: { width: 1440, height: 900, name: 'Large Desktop' },
  };

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Device Compatibility', () => {
    Object.values(devices).forEach((device) => {
      it(`should work properly on ${device.name} (${device.width}x${device.height})`, () => {
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
  });

  describe('Edge Cases', () => {
    it('should work on very small screens', () => {
      setViewportSize(320, 480);
      renderWithThemeAndI18n(<CreateUserProfilePage />);

      expect(screen.getByText('Hello City')).toBeVisible();
      expect(screen.getByLabelText(/gender/i)).toBeVisible();
      expect(screen.getByRole('button', { name: /I'm all set/i })).toBeVisible();
    });

    it('should work on very large screens', () => {
      setViewportSize(1920, 1080);
      renderWithThemeAndI18n(<CreateUserProfilePage />);

      expect(screen.getByText('Hello City')).toBeVisible();
      expect(screen.getByLabelText(/gender/i)).toBeVisible();
      expect(screen.getByRole('button', { name: /I'm all set/i })).toBeVisible();
    });

    it('should handle landscape orientation on mobile', () => {
      setViewportSize(667, 375);
      renderWithThemeAndI18n(<CreateUserProfilePage />);

      expect(screen.getByText('Hello City')).toBeVisible();
      expect(screen.getByLabelText(/gender/i)).toBeVisible();
    });
  });
});
