import dynamic from 'next/dynamic';

const TryHelloCityButtonClient = dynamic(
  () => import('@/components/HomePage/TryHelloCityButtonClient'),
  {
    ssr: false,
  },
);

export function TryHelloCityButton({ variant = 'hero' }: { variant?: 'hero' | 'cta' }) {
  return <TryHelloCityButtonClient variant={variant} />;
}
