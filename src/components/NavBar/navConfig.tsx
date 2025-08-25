import type { ReactNode } from 'react';

export interface NavItem {
  id: string;
  href: string;
  label: ReactNode;
  onClick?: () => void;
  childrenItem?: NavItem[];
}

export const MOBILE_BREAKPOINT = '(min-width:1024px)';
