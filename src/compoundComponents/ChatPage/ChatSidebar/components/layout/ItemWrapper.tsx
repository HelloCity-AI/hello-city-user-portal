'use client';

import type { ReactNode } from 'react';
import { mergeClassNames } from '@/utils/classNames';

type ItemWrapperVariant = 'none' | 'compact' | 'normal' | 'spacious';

interface ItemWrapperProps {
  children: ReactNode;
  variant?: ItemWrapperVariant;
  className?: string;
}

/**
 * Item Wrapper Component - Provides consistent vertical spacing between sidebar items
 */
export default function ItemWrapper({
  children,
  variant = 'compact',
  className,
}: ItemWrapperProps) {
  const variantClasses = {
    none: 'mb-0', // 0px
    compact: 'mb-1', // 4px
    normal: 'mb-2', // 8px
    spacious: 'mb-3', // 12px
  } as const;

  return (
    <div className={mergeClassNames('w-auto', variantClasses[variant], className)}>{children}</div>
  );
}
