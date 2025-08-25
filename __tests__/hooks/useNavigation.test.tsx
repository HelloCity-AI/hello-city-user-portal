import { renderHook, act } from '@testing-library/react';
import { useNavItems } from '@/hooks/useNavigation';
import { TestProviders } from '../utils/TestWrapper';

const mockAlert = jest.fn();
global.alert = mockAlert;

describe('useNavItems', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Returns navigation items with correct structure', () => {
    const { result } = renderHook(() => useNavItems(), {
      wrapper: TestProviders,
    });

    const navItems = result.current;
    expect(navItems).toHaveLength(4);
    expect(navItems[0].href).toBe('/en'); // Tests href generation
  });

  it('Executes onClick handlers correctly', () => {
    const { result } = renderHook(() => useNavItems(), {
      wrapper: TestProviders,
    });

    const navItems = result.current;

    // Test chat and contact alerts
    act(() => navItems[1].onClick?.()); // chat
    act(() => navItems[2].onClick?.()); // contact

    // Test language switching
    const languageOptions = navItems[3].childrenItem;
    act(() => languageOptions?.[0].onClick?.()); // English
    act(() => languageOptions?.[1].onClick?.()); // Chinese
    act(() => languageOptions?.[2].onClick?.()); // Coming soon

    expect(mockAlert).toHaveBeenCalledWith('chat');
    expect(mockAlert).toHaveBeenCalledWith('contact');
    expect(mockAlert).toHaveBeenCalledWith('Coming soon');
  });
});
