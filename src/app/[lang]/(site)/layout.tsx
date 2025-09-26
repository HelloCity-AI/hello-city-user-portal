import { NavBar } from '@/compoundComponents';
import { type ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>{children}</main>
    </>
  );
}
