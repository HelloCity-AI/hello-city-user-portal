import { renderHook, act } from '@testing-library/react';
import { useNavigation } from '@/hooks/useNavigation';
import { TestProviders } from '../utils/TestWrapper';

const mockAlert = jest.fn();
global.alert = mockAlert;

describe('useNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Returns navigation config with correct structure', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: TestProviders,
    });

    const { navItems, currentLanguage, logo } = result.current;
    expect(navItems).toHaveLength(3);
    expect(navItems[0].href).toBe('/en'); // Tests href generation
    expect(currentLanguage.code).toBe('en');
    expect(logo.href).toBe('/en/');
  });

  it('Executes onClick handlers correctly', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: TestProviders,
    });

    const { navItems } = result.current;

    // Test chat alert (contact item has no onClick, it uses href)
    act(() => navItems[1].onClick?.()); // chat

    expect(mockAlert).toHaveBeenCalledWith('chat');
  });
});
