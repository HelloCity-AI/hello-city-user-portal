import { memo } from 'react';

import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import IconButton from '@mui/material/IconButton';

import { mergeClassNames } from '@/utils/classNames';

interface CollapsedToggleProps {
  onToggle: () => void;
}

const CollapsedToggle = memo(({ onToggle }: CollapsedToggleProps) => {
  return (
    <div
      className={mergeClassNames(
        'absolute z-10 h-10 w-8 rounded-lg',
        // Mobile: position symmetrically opposite to sidebar toggle with 28px inset and vertical alignment
        'right-7 mt-2 translate-x-0 pt-2 md:right-6 md:top-1/2 md:mt-0 md:-translate-y-1/2 md:pt-0',
      )}
    >
      <IconButton
        onClick={onToggle}
        className={mergeClassNames(
          // Mobile: blue background (collapsed state only)
          'h-8 w-8 bg-blue-500/10 text-gray-600 hover:bg-blue-500/20',
          // Desktop: original round design with white background
          'md:h-10 md:w-10 md:rounded-full md:border md:border-solid md:border-gray-200 md:bg-white md:shadow-sm md:hover:bg-gray-50',
        )}
        aria-label="Show checklist panel"
        disableRipple
        sx={{
          '&:focus': {
            outline: 'none',
          },
          '&:active': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <MapOutlinedIcon
          className={mergeClassNames(
            // Mobile: match sidebar toggle icon color
            'text-gray-600',
            // Desktop: use primary color
            'md:text-primary',
          )}
          sx={{
            fontSize: '1.25rem', // Thinner icon (20px instead of default 24px)
          }}
        />
      </IconButton>
    </div>
  );
});

CollapsedToggle.displayName = 'CollapsedToggle';

export default CollapsedToggle;
