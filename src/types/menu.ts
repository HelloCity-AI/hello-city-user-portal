import type { ReactNode } from 'react';

export interface MenuOption {
  id: string;
  label: ReactNode;
  value: string;
  icon?: React.ElementType | null;
  divider?: boolean;
  onClick: (value?: string) => void | ReactNode;
}

export type DropdownOptionProps = MenuOption;
