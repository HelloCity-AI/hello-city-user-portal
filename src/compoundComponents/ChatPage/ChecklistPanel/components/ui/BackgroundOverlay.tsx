import Box from '@mui/material/Box';
import { mergeClassNames } from '@/utils/classNames';

interface BackgroundOverlayProps {
  className?: string;
}

export default function BackgroundOverlay({ className }: BackgroundOverlayProps) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom, #e9defa 40%, #fff5e6 50%,#ffffff 70%,#ffffff 100%)',
      }}
      className={mergeClassNames('absolute bottom-0 left-0 right-0 top-0 z-0', className)}
      data-testid="background-overlay"
    />
  );
}
