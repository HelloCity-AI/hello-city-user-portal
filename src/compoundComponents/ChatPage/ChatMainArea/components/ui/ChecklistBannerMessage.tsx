import { memo, useCallback } from 'react';

import { Trans } from '@lingui/react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';

import { setActiveChecklist } from '@/store/slices/checklist';
import { mergeClassNames } from '@/utils/classNames';

import type { ChecklistBanner } from '@/compoundComponents/ChatPage/ChecklistPanel/types';

interface ChecklistBannerMessageProps {
  banner: ChecklistBanner;
  onBannerClick?: () => void;
}

const ChecklistBannerMessage = memo(({ banner, onBannerClick }: ChecklistBannerMessageProps) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    // Activate this checklist in Redux
    dispatch(setActiveChecklist(banner.checklistId));
    // Trigger optional callback (e.g., open ChecklistPanel)
    onBannerClick?.();
  }, [banner.checklistId, dispatch, onBannerClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={mergeClassNames(
        'group relative flex w-full max-w-sm flex-col gap-3 rounded-xl border p-4 transition-all',
        'border-primary/30 from-primary/5 to-primary/10 bg-gradient-to-br',
        'hover:shadow-primary/20 hover:border-primary hover:shadow-lg',
      )}
    >
      {/* Title */}
      <Typography variant="h6" className="line-clamp-1 text-left font-bold text-gray-900">
        {banner.title}
      </Typography>

      {/* Footer: Chips + View Details */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Chip
            label={`v${banner.version}`}
            size="small"
            className="h-6 bg-primary text-xs font-semibold text-white"
          />
          <Chip
            label={<Trans id="checklist.banner.new" message="New Checklist" />}
            size="small"
            className="h-6 bg-green-100 text-xs font-medium text-green-700"
          />
        </div>

        <Typography variant="caption" className="text-primary group-hover:underline">
          <Trans id="checklist.banner.viewDetails" message="View Details →" />
        </Typography>
      </div>
    </button>
  );
});

ChecklistBannerMessage.displayName = 'ChecklistBannerMessage';

export default ChecklistBannerMessage;
