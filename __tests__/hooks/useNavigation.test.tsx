import { renderHook } from '@testing-library/react';
import { useNavigation } from '@/hooks/useNavigation';
import { TestProviders } from '../utils/TestWrapper';

describe('useNavigation', () => {
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

  it('Chat navigation item uses href instead of onClick', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: TestProviders,
    });

    const { navItems } = result.current;
    const chatItem = navItems[1]; // chat item

    // Chat item should have href but no onClick handler
    expect(chatItem.href).toBe('/en/assistant');
    expect(chatItem.onClick).toBeUndefined();
  });
});
