/**
 * ChatSidebar Style Constants
 * Centralized styles for consistency across ChatSidebar components
 */

// Common hover effects
export const HOVER_EFFECTS = {
  light: 'hover:bg-black/5',
  transparent: 'hover:bg-transparent',
  blue: 'hover:bg-blue-500/15',
} as const;

// Common text styles
export const TEXT_STYLES = {
  sidebarText: 'select-none whitespace-nowrap pl-3 text-sm',
  titleText: 'select-none whitespace-nowrap pl-3 text-lg font-bold text-gray-800',
  historyTitle: 'block pb-1 pl-3 text-xs font-medium uppercase tracking-wide text-gray-600',
} as const;

// Common icon styles
export const ICON_STYLES = {
  action: 'text-lg text-gray-600',
  button: 'h-8 w-8 text-gray-600',
  small: 'h-4 w-4 opacity-60',
  arrow: 'text-base text-gray-500 transition-transform duration-200 ease-out',
} as const;

// Common container styles
export const CONTAINER_STYLES = {
  clickable: 'cursor-pointer',
  rounded: 'rounded-lg',
  centered: 'flex items-center justify-center',
  flexRow: 'flex items-center',
} as const;
