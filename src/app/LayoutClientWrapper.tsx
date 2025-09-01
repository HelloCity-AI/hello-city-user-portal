'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { NavBar } from '@/components/NavBar';

export default function LayoutClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavBar = pathname?.includes('/contact-us');

  return (
    <>
      {!hideNavBar && <NavBar />}
      {children}
    </>
  );
}
