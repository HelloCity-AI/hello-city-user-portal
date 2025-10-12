import { memo, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AnimatePresence, Reorder } from 'framer-motion';
import Box from '@mui/material/Box';

import { mergeClassNames } from '@/utils/classNames';

import AddButton from '../ui/AddButton';
import ChecklistCard from '../ui/ChecklistCard';
import ChecklistEmptyState from '../ui/ChecklistEmptyState';
import ChecklistItemModal from '@/compoundComponents/Modals/ChecklistItemModal';
import { createChecklistItemRequest } from '@/store/sagas/checklistSaga';
import type { RootState } from '@/store';
import type { CreateItemRequest } from '@/api/checklistItemApi';

import type { ChecklistSectionProps } from '../../types';

const ChecklistSection = memo(({ items, filter, handlers }: ChecklistSectionProps) => {
  const dispatch = useDispatch();
  const hasItems = items.length > 0;
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Use stable state for values to prevent Framer Motion reorder issues
  const [stableValues, setStableValues] = useState<string[]>([]);
  const prevItemsRef = useRef(items);

  // Update stable values only when items actually change
  useEffect(() => {
    const itemIds = items.map(item => item.id);
    const prevIds = prevItemsRef.current.map(item => item.id);

    // Only update if the IDs have actually changed
    if (itemIds.length !== prevIds.length || !itemIds.every((id, i) => id === prevIds[i])) {
      setStableValues(itemIds);
      prevItemsRef.current = items;
    }
  }, [items]);

  // Get active checklist and conversation from Redux
  const activeChecklistId = useSelector((state: RootState) => state.checklist.activeChecklistId);
  const checklists = useSelector((state: RootState) => state.checklist.checklists);

  // Conditional logic AFTER hooks
  const checklist = activeChecklistId ? checklists[activeChecklistId] : null;
  const conversationId = checklist?.conversationId;

  // Only allow drag in 'all' filter to prevent grouping filtered items at the top
  const canDrag = filter === 'all';

  const handleAdd = async (data: CreateItemRequest) => {
    console.log('🔍 [ChecklistSection] handleAdd called', {
      conversationId,
      activeChecklistId,
      checklist,
      data,
    });

    if (!conversationId || !activeChecklistId) {
      console.warn('❌ [ChecklistSection] Missing conversationId or activeChecklistId', {
        conversationId,
        activeChecklistId,
      });
      return;
    }

    console.log('✅ [ChecklistSection] Dispatching createChecklistItemRequest');
    dispatch(
      createChecklistItemRequest({
        conversationId,
        checklistId: activeChecklistId,
        data,
      }),
    );
  };

  return (
    <Box
      className={mergeClassNames(
        'glass flex-1 overflow-hidden rounded-2xl',
        'border border-white/60 bg-white/85 backdrop-blur-[15px]',
      )}
    >
      <Box
        className={mergeClassNames('h-full overflow-y-auto p-2 pr-1')}
        sx={{
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 3,
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.3)',
            },
          },
        }}
      >
        {hasItems ? (
          <AnimatePresence>
            <Reorder.Group
              axis="y"
              values={stableValues}
              onReorder={handlers.onReorder}
              layoutScroll
              style={{ listStyle: 'none', padding: 0, margin: 0 }}
            >
              {items.map((item) => (
                <ChecklistCard
                  key={item.id}
                  item={item}
                  onToggle={handlers.onToggle}
                  onEdit={handlers.onEdit}
                  onDelete={handlers.onDelete}
                  canDrag={canDrag}
                />
              ))}
            </Reorder.Group>
          </AnimatePresence>
        ) : (
          <Box>
            {/* <Box className="mb-2 text-center text-4xl opacity-50">
              {filter === 'completed' ? '✅' : filter === 'incomplete' ? '⏳' : '📋'}
            </Box> */}
            <ChecklistEmptyState filter={filter} />
          </Box>
        )}

        <AddButton onClick={() => setAddModalOpen(true)} />
      </Box>

      {/* Add Modal */}
      <ChecklistItemModal
        open={addModalOpen}
        mode="add"
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAdd}
      />
    </Box>
  );
});

ChecklistSection.displayName = 'ChecklistSection';

export default ChecklistSection;
