import { memo, useCallback } from 'react';

import { Trans } from '@lingui/react';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';

import { setActiveChecklist } from '@/store/slices/checklist';
import { mergeClassNames } from '@/utils/classNames';

import type { ChecklistMetadata } from '@/compoundComponents/ChatPage/ChecklistPanel/types';
import type { RootState } from '@/store';

interface ChecklistBannerMessageProps {
  checklistId: string;
  initialData: ChecklistMetadata;
  onBannerClick?: () => void;
}

const ChecklistBannerMessage = memo(
  ({ checklistId, initialData, onBannerClick }: ChecklistBannerMessageProps) => {
    const dispatch = useDispatch();

    const liveChecklist = useSelector(
      (state: RootState) => state.checklist.checklists[checklistId],
    );

    // Fallback to initial data until Redux receives the completed payload.
    const banner: ChecklistMetadata = liveChecklist ?? initialData;
    const isGenerating = banner.status === 'generating';

    const handleClick = useCallback(() => {
      if (isGenerating) return;
      dispatch(setActiveChecklist(checklistId));
      onBannerClick?.();
    }, [dispatch, checklistId, onBannerClick, isGenerating]);

    const titleContent = isGenerating ? (
      <Trans id="checklist.banner.generatingTitle" message="Creating your checklist…" />
    ) : (
      banner.title
    );

    return (
      <button
        type="button"
        disabled={isGenerating}
        onClick={handleClick}
        className={mergeClassNames(
          'group relative flex w-full max-w-sm flex-col gap-3 rounded-xl border p-4 transition-all',
          'border-primary/30 from-primary/5 to-primary/10 bg-gradient-to-br',
          'hover:shadow-primary/10 hover:shadow-md',
          isGenerating && 'cursor-not-allowed opacity-80 hover:shadow-none',
        )}
        aria-disabled={isGenerating}
      >
        {/* Title and Notice Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 flex-col gap-2">
            {/* Title */}
            <Typography variant="h6" className="line-clamp-1 text-left font-bold text-gray-900">
              {titleContent}
            </Typography>

            {/* Generating Notice */}
            {isGenerating && (
              <Typography variant="caption" className="text-left text-amber-700">
                <Trans
                  id="checklist.banner.generatingNotice"
                  message="Checklist generation may take 3-5 minutes. Please be patient."
                />
              </Typography>
            )}
          </div>

          {/* Loading Indicator - Right Side (only when generating) */}
          {isGenerating && (
            <div className="flex-shrink-0 pt-1">
              <CircularProgress size={24} className="text-amber-600" />
            </div>
          )}
        </div>

        {/* Footer: Version Chip + View Details (hidden when generating) */}
        {!isGenerating && (
          <div className="flex items-center justify-between">
            <Chip
              label={`v${banner.version}`}
              size="small"
              className="h-6 bg-primary text-xs font-semibold text-white"
            />

            <Typography variant="caption" className="text-primary group-hover:underline">
              <Trans id="checklist.banner.viewDetails" message="View Details →" />
            </Typography>
          </div>
        )}
      </button>
    );
  },
);

ChecklistBannerMessage.displayName = 'ChecklistBannerMessage';

export default ChecklistBannerMessage;
