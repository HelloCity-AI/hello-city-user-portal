'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTryHelloCiti } from '@/hooks/useTryHelloCiti';

interface TryHelloCitiButtonClientProps {
  variant: 'hero' | 'cta';
}

export default function TryHelloCitiButtonClient({ variant }: TryHelloCitiButtonClientProps) {
  const { onClick, isLoading, LoginModal, label } = useTryHelloCiti();

  if (variant === 'hero') {
    return (
      <>
        <Button
          onClick={onClick}
          disabled={isLoading}
          variant="primary"
          sx={{ marginTop: '6px' }}
          className="group w-[200px] font-semibold"
        >
          {label}&nbsp;&nbsp;
          <Typography component="span" className="transition-transform group-hover:translate-x-2">
            →
          </Typography>
        </Button>
        {LoginModal}
      </>
    );
  }

  return (
    <>
      <Button
        onClick={onClick}
        disabled={isLoading}
        className="group mt-5 rounded-full bg-white px-10 py-3 font-semibold"
        sx={{ color: 'theme.plate.primary' }}
      >
        {label}&nbsp;&nbsp;
        <Typography component="span" className="transition-transform group-hover:translate-x-2">
          →
        </Typography>
      </Button>
      {LoginModal}
    </>
  );
}
