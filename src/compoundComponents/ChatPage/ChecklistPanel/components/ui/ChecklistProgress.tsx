import { memo } from 'react';

import { Trans } from '@lingui/react';
import { useTheme } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import { mergeClassNames } from '@/utils/classNames';

import type { ProgressSectionProps } from '../../types';

const filterOptions = [
  {
    value: 'all' as const,
    label: <Trans id="checklist.filter.all" message="All" />,
  },
  {
    value: 'completed' as const,
    label: <Trans id="checklist.filter.completed" message="Completed" />,
  },
  {
    value: 'incomplete' as const,
    label: <Trans id="checklist.filter.incomplete" message="Incomplete" />,
  },
];

const ChecklistProgress = memo(({ stats, filter, onFilterChange }: ProgressSectionProps) => {
  const theme = useTheme();

  return (
    <div className="flex flex-col gap-3">
      {/* Progress Bar */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Typography variant="body2" className="text-gray-600">
            <Trans id="checklist.progress" message="Progress" />
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {stats.completed}/{stats.total}
          </Typography>
        </div>
        <LinearProgress
          variant="determinate"
          value={stats.progress}
          className="h-1.5 rounded-sm bg-gray-300"
          sx={{
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={mergeClassNames(
              'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all',
              filter === option.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900',
            )}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
});

ChecklistProgress.displayName = 'ChecklistProgress';

export default ChecklistProgress;
