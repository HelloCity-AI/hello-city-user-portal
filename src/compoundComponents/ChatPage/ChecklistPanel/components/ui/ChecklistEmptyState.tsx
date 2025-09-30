import { Trans } from '@lingui/react';
import Typography from '@mui/material/Typography';

import type { FilterType } from '@/compoundComponents/ChatPage/ChecklistPanel/types';

interface EmptyStateProps {
  filter: FilterType;
}

export default function ChecklistEmptyState({ filter }: EmptyStateProps) {
  return (
    <div className="py-8 text-center">
      <Typography variant="body2" color="text.secondary">
        {filter === 'completed' ? (
          <Trans id="checklist.empty.completed" message="No completed items" />
        ) : filter === 'incomplete' ? (
          <Trans id="checklist.empty.incomplete" message="No incomplete items" />
        ) : (
          <Trans id="checklist.empty.all" message="No checklist items" />
        )}
      </Typography>
    </div>
  );
}
