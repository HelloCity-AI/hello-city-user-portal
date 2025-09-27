import { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { mergeClassNames } from '@/utils/classNames';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = memo(({ onClick }: BackButtonProps) => {
  return (
    <div className="absolute left-6 top-6 z-20">
      <IconButton
        onClick={onClick}
        size="small"
        className={mergeClassNames(
          'bg-black/50 text-white backdrop-blur-[10px]',
          'border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.2)]',
          'hover:scale-105 hover:bg-black/70',
          'transition-all duration-200 ease-out',
        )}
      >
        <ChevronRightOutlinedIcon fontSize="small" />
      </IconButton>
    </div>
  );
});

BackButton.displayName = 'BackButton';

export default BackButton;
