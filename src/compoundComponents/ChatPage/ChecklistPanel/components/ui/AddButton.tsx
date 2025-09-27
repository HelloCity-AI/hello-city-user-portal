import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { Trans } from '@lingui/react';
import { mergeClassNames } from '@/utils/classNames';

interface AddButtonProps {
  onClick: () => void;
}

export default function AddButton({ onClick }: AddButtonProps) {
  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={onClick}
      className={mergeClassNames(
        'mt-4 py-3',
        'border border-dashed border-border text-muted-foreground',
        'hover:border-primary-color hover:bg-black/5',
      )}
    >
      <Trans id="checklist.add.button" message="Add New Item" />
    </Button>
  );
}
