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
    expect(navItems).toHaveLength(4);
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

    // Test language switching
    const languageOptions = navItems[3].childrenItem;
    act(() => languageOptions?.[0].onClick?.()); // English
    act(() => languageOptions?.[1].onClick?.()); // Chinese
    act(() => languageOptions?.[2].onClick?.()); // Coming soon

    expect(mockAlert).toHaveBeenCalledWith('chat');
    expect(mockAlert).toHaveBeenCalledWith('Coming soon');
  });
});
