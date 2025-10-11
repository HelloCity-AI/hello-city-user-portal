import { memo } from 'react';

import { AnimatePresence, Reorder } from 'framer-motion';
import Box from '@mui/material/Box';

import { mergeClassNames } from '@/utils/classNames';

import AddButton from '../ui/AddButton';
import ChecklistCard from '../ui/ChecklistCard';
import ChecklistEmptyState from '../ui/ChecklistEmptyState';

import type { ChecklistSectionProps } from '../../types';

const ChecklistSection = memo(({ items, filter, handlers }: ChecklistSectionProps) => {
  const hasItems = items.length > 0;

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
              values={items.map((item) => item.id)}
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

        <AddButton onClick={handlers.onAdd} />
      </Box>
    </Box>
  );
});

ChecklistSection.displayName = 'ChecklistSection';

export default ChecklistSection;
