import Box from '@mui/material/Box';
import { mergeClassNames } from '@/utils/classNames';

interface ImageOverlayProps {
  className?: string;
}

export default function ImageOverlay({ className }: ImageOverlayProps) {
  return (
    <Box
      sx={{
        background:
          'linear-gradient(to bottom, transparent 0%, rgba(233, 222, 250, 0.2) 30%, rgba(233, 222, 250, 0.6) 70%, rgba(233, 222, 250, 0.85) 80%, #e9defa 100%)',
      }}
      className={mergeClassNames('absolute bottom-0 left-0 right-0 z-[2] h-[80%]', className)}
      data-testid="image-overlay"
    />
  );
}
