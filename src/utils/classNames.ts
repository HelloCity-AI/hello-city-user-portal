import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge className values with clsx and tailwind-merge support.
 */
export function mergeClassNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
