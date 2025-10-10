import { Reorder } from 'framer-motion';
import { Trans } from '@lingui/react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Checkbox from '@/components/Checkbox';
import { mergeClassNames } from '@/utils/classNames';
import { formatDueDate, getDueDateUrgencyColor } from '../../utils/dateFormatter';

import type { ChecklistCardProps } from '../../types';

const importanceStyles: Record<
  'high' | 'medium' | 'low',
  { bg: string; text: string; label: JSX.Element }
> = {
  high: {
    bg: '#FEE2E2',
    text: '#DC2626',
    label: <Trans id="checklist.importance.high" message="HIGH" />,
  },
  medium: {
    bg: '#FEF3C7',
    text: '#D97706',
    label: <Trans id="checklist.importance.medium" message="MED" />,
  },
  low: {
    bg: '#DBEAFE',
    text: '#2563EB',
    label: <Trans id="checklist.importance.low" message="LOW" />,
  },
};

const CHIP_BASE_CLASSES = 'h-5 text-[10px]';

export default function ChecklistCard({
  item,
  onToggle,
  onEdit: _onEdit,
  onDelete: _onDelete,
}: ChecklistCardProps) {
  const importanceStyle = item.importance ? importanceStyles[item.importance] : null;

  // TODO: Implement edit functionality with modal (_onEdit)
  // TODO: Implement delete functionality with confirmation (_onDelete)
  // PLACEHOLDER: Add dropdown menu for edit/delete actions

  return (
    <Reorder.Item
      value={item.id}
      id={item.id}
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      whileDrag={{ scale: 1.02, zIndex: 100 }}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
      style={{ listStyle: 'none' }}
    >
      <div
        className={mergeClassNames(
          'group relative mb-3 flex min-h-[120px] flex-col',
          'rounded-xl bg-white p-4',
          'border border-gray-200 shadow-sm',
          'cursor-grab transition-all hover:border-blue-300 hover:shadow-md active:cursor-grabbing',
          item.isComplete ? 'opacity-70' : 'opacity-100',
        )}
      >
        {/* Title Row with Actions */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Checkbox inline with title */}
            <Checkbox
              label=""
              checked={item.isComplete}
              onChange={() => onToggle(item.id)}
              size="medium"
              color="primary"
              className="flex-shrink-0"
            />
            <Typography
              variant="body1"
              className={mergeClassNames(
                'text-[15px] font-semibold leading-[1.4]',
                item.isComplete ? 'text-gray-400 line-through' : 'text-gray-900',
              )}
            >
              {item.title}
            </Typography>

            {importanceStyle && (
              <div
                className="h-4 flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                style={{
                  backgroundColor: importanceStyle.bg,
                  color: importanceStyle.text,
                }}
              >
                {importanceStyle.label}
              </div>
            )}
          </div>

          {/* Actions - More options */}
          <IconButton
            size="small"
            className={mergeClassNames(
              'h-6 w-6 min-w-0 p-1',
              'border border-gray-300',
              'opacity-0 transition-opacity group-hover:opacity-100',
              'hover:border-gray-400 hover:bg-gray-50',
            )}
          >
            <MoreHorizIcon className="text-sm" />
          </IconButton>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col">
          {item.description && (
            <Typography
              variant="body2"
              className={mergeClassNames(
                'mb-6 overflow-hidden text-[13px] leading-[1.4]',
                item.isComplete ? 'text-gray-400' : 'text-gray-600',
              )}
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {item.description}
            </Typography>
          )}

          {/* Chips Fixed at Bottom */}
          <div className="mt-auto flex flex-wrap items-center gap-1">
            {item.dueDate && (
              <Chip
                icon={<CalendarTodayOutlinedIcon className="text-xs" />}
                label={
                  <>
                    <Trans id="checklist.due.prefix" message="Due:" /> {formatDueDate(item.dueDate)}
                  </>
                }
                size="small"
                className={mergeClassNames(CHIP_BASE_CLASSES, getDueDateUrgencyColor(item.dueDate))}
                sx={{
                  '& .MuiChip-icon': {
                    fontSize: 12,
                    ml: 0.5,
                  },
                }}
              />
            )}

            {item.category && (
              <Chip
                label={item.category}
                size="small"
                className={mergeClassNames(CHIP_BASE_CLASSES, 'bg-blue-50 text-blue-600')}
              />
            )}
          </div>
        </div>
      </div>
    </Reorder.Item>
  );
}
