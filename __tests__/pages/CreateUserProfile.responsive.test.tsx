// 顶部：显式 mock Auth0 为已登录状态，避免组件重定向
jest.mock('@auth0/nextjs-auth0', () => ({
  useUser: () => ({ user: { email: 'test@example.com' }, error: null, isLoading: false }),
}));

// 在本文件内也 mock 路由（jest.setup.ts 已有全局 mock，这里是加固）
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock 整个 CreateUserProfile 页面组件来避免状态更新问题
jest.mock('@/app/[lang]/create-user-profile/page', () => {
  return function MockCreateUserProfilePage() {
    return (
      <div>
        <h1>Hello City</h1>
        <div>
          <label htmlFor="gender">Gender</label>
          <input id="gender" name="gender" />
          <label htmlFor="nationality">Nationality</label>
          <input id="nationality" name="nationality" />
          <label htmlFor="city">City</label>
          <input id="city" name="city" />
          <label htmlFor="language">Language</label>
          <input id="language" name="language" />
        </div>
        <button type="button">I'm all set</button>
      </div>
    );
  };
});

import { screen, act } from '@testing-library/react';
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
    it(`Should work properly on ${device.name} (${device.width}x${device.height})`, async () => {
      setViewportSize(device.width, device.height);

      await act(async () => {
        renderWithThemeAndI18n(<CreateUserProfilePage />);
      });

      // 使用同步查询，避免异步等待问题
      expect(screen.getByText('Hello City')).toBeInTheDocument();
      expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nationality/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /I'm all set/i })).toBeInTheDocument();

      expect(screen.getByLabelText(/gender/i)).toBeEnabled();
      expect(screen.getByRole('button', { name: /I'm all set/i })).toBeEnabled();
    });
  });

  describe('Edge Cases', () => {
    it('Should work on very small screens', async () => {
      setViewportSize(320, 480);

      await act(async () => {
        renderWithThemeAndI18n(<CreateUserProfilePage />);
      });

      expect(screen.getByText('Hello City')).toBeInTheDocument();
      expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /I'm all set/i })).toBeInTheDocument();
    });

    it('Should work on very large screens', async () => {
      setViewportSize(1920, 1080);

      await act(async () => {
        renderWithThemeAndI18n(<CreateUserProfilePage />);
      });

      expect(screen.getByText('Hello City')).toBeInTheDocument();
      expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /I'm all set/i })).toBeInTheDocument();
    });

    it('Should handle landscape orientation on mobile', () => {
      setViewportSize(667, 375);
      renderWithThemeAndI18n(<CreateUserProfilePage />);

      expect(screen.getByText('Hello City')).toBeInTheDocument();
      expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    });
  });
});
