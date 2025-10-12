import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Reorder, useDragControls } from 'framer-motion';
import { Trans } from '@lingui/react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import Checkbox from '@/components/Checkbox';
import Dropdown from '@/components/Dropdown';
import { mergeClassNames } from '@/utils/classNames';
import { formatDueDate, getDueDateUrgencyColor } from '../../utils/dateFormatter';
import ChecklistItemModal from '@/compoundComponents/Modals/ChecklistItemModal';
import { useDeleteConfirmation } from '@/hooks/modals/useDeleteConversationHistory';
import {
  toggleChecklistItemRequest,
  updateChecklistItemRequest,
  deleteChecklistItemRequest,
} from '@/store/sagas/checklistSaga';
import type { CreateItemRequest } from '@/api/checklistItemApi';
import type { MenuOption } from '@/types/menu';

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
    label: <Trans id="checklist.importance.medium" message="MEDIUM" />,
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
  canDrag = true,
}: ChecklistCardProps) {
  const dispatch = useDispatch();
  const importanceStyle = item.importance ? importanceStyles[item.importance] : null;
  const dragControls = useDragControls();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete confirmation modal
  const { show: showDeleteModal, ModalNode: DeleteModal } = useDeleteConfirmation({
    onDelete: () => {
      setIsDeleting(true);
      dispatch(
        deleteChecklistItemRequest({
          conversationId: item.conversationId,
          checklistId: item.checklistId,
          itemId: item.id,
        }),
      );
    },
    title: <Trans id="checklist-item.delete.title" message="Delete Item" />,
    description: (
      <Trans
        id="checklist-item.delete.description"
        message="Are you sure you want to delete this checklist item? This action cannot be undone."
      />
    ),
    confirmText: <Trans id="common.delete" message="Delete" />,
    cancelText: <Trans id="common.cancel" message="Cancel" />,
  });

  // Handle checkbox toggle
  const handleToggle = () => {
    dispatch(
      toggleChecklistItemRequest({
        conversationId: item.conversationId,
        checklistId: item.checklistId,
        itemId: item.id,
        isComplete: !item.isComplete,
      }),
    );
  };

  // Handle edit submit
  const handleEdit = async (data: CreateItemRequest) => {
    dispatch(
      updateChecklistItemRequest({
        conversationId: item.conversationId,
        checklistId: item.checklistId,
        itemId: item.id,
        data,
      }),
    );
  };

  // Menu options for dropdown
  const menuOptions: MenuOption[] = [
    {
      id: `edit-item-${item.id}`,
      label: <Trans id="checklist-item.edit" message="Edit Item" />,
      value: 'edit',
      icon: EditOutlined,
      divider: false,
      onClick: () => setEditModalOpen(true),
    },
    {
      id: `delete-item-${item.id}`,
      label: <Trans id="checklist-item.delete" message="Delete Item" />,
      value: 'delete',
      icon: DeleteOutline,
      divider: false,
      onClick: showDeleteModal,
    },
  ];

  return (
    <Reorder.Item
      value={item.id}
      id={item.id}
      dragListener={false}
      dragControls={dragControls}
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
          'transition-all hover:border-blue-300 hover:shadow-md',
          item.isComplete ? 'opacity-70' : 'opacity-100',
        )}
      >
        {/* Title Row with Actions */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-0 md:gap-1">
            {/* Drag Handle - Aligned with checkbox */}
            <div
              className={mergeClassNames(
                'flex h-8 w-8 flex-shrink-0 items-center justify-center',
                canDrag ? 'cursor-grab' : 'cursor-not-allowed opacity-40',
              )}
              onPointerDown={(e) => {
                if (canDrag) {
                  dragControls.start(e);
                }
              }}
              style={{ touchAction: canDrag ? 'none' : 'auto' }}
            >
              <DragIndicatorIcon className="text-gray-400" sx={{ fontSize: 20 }} />
            </div>

            {/* Checkbox inline with title */}
            <Checkbox
              label=""
              checked={item.isComplete}
              onChange={handleToggle}
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
          {isDeleting ? (
            <CircularProgress size={20} />
          ) : (
            <Dropdown
              anchorElContent={
                <IconButton
                  component="div"
                  size="small"
                  className={mergeClassNames(
                    'h-8 w-8 min-w-0 p-1',
                    'border border-gray-300',
                    'opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100',
                    'hover:border-gray-400 hover:bg-gray-50',
                  )}
                >
                  <MoreHorizIcon sx={{ fontSize: 20 }} />
                </IconButton>
              }
              dropdownOptions={menuOptions}
              layout="vertical"
              disableIconButton
            />
          )}
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

      {/* Edit Modal */}
      <ChecklistItemModal
        open={editModalOpen}
        mode="edit"
        item={item}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEdit}
      />

      {/* Delete Confirmation Modal */}
      {DeleteModal}
    </Reorder.Item>
  );
}
