import { memo, useCallback } from 'react';

import { Trans } from '@lingui/react';
import Chip from '@mui/material/Chip';
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
      <Trans
        id="checklist.banner.generatingTitle"
        message="Creating your personalized checklist…"
      />
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
          'hover:shadow-primary/20 hover:border-primary hover:shadow-lg',
          isGenerating && 'hover:border-primary/30 cursor-not-allowed opacity-80 hover:shadow-none',
        )}
        aria-disabled={isGenerating}
      >
        {/* Title */}
        <Typography variant="h6" className="line-clamp-1 text-left font-bold text-gray-900">
          {titleContent}
        </Typography>

        {/* Footer: Version Chip + View Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Chip
              label={
                isGenerating ? (
                  <Trans id="checklist.banner.generating" message="Generating…" />
                ) : (
                  `v${banner.version}`
                )
              }
              size="small"
              className={
                isGenerating
                  ? 'h-6 bg-amber-100 text-xs font-medium text-amber-700'
                  : 'h-6 bg-primary text-xs font-semibold text-white'
              }
            />
          </div>

          <Typography variant="caption" className="text-primary group-hover:underline">
            {isGenerating ? (
              <Trans id="checklist.banner.inProgress" message="Preparing checklist…" />
            ) : (
              <Trans id="checklist.banner.viewDetails" message="View Details →" />
            )}
          </Typography>
        </div>
      </button>
    );
  },
);

ChecklistBannerMessage.displayName = 'ChecklistBannerMessage';

export default ChecklistBannerMessage;
