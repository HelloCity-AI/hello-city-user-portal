import { memo } from 'react';

import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import IconButton from '@mui/material/IconButton';

import { mergeClassNames } from '@/utils/classNames';

interface CollapsedToggleProps {
  onToggle: () => void;
}

const CollapsedToggle = memo(({ onToggle }: CollapsedToggleProps) => {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2">
      <IconButton
        onClick={onToggle}
        className={mergeClassNames(
          'h-10 w-10 rounded-full bg-white shadow-sm',
          'border border-solid border-gray-200',
          'transition-all duration-200 ease-out hover:bg-gray-50',
        )}
        aria-label="Show checklist panel"
      >
        <MapOutlinedIcon className="text-primary" />
      </IconButton>
    </div>
  );
});

CollapsedToggle.displayName = 'CollapsedToggle';

export default CollapsedToggle;
