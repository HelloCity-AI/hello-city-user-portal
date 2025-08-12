import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import type { Trans } from '@lingui/react';
import type { ReactNode } from 'react';

export const DIALOG_ACTIONS_PADDING_X = 2;
const ACTION_BUTTON_PROPS = {
  sx: {
    fontWeight: 600,
    minWidth: '100px',
  },
} as const;

export const renderTitle = (
  title: React.ReactElement<typeof Trans> | string,
  textAlignCenter?: boolean,
) => {
  return (
    <DialogTitle id="modal-title" variant="h4" textAlign={textAlignCenter ? 'center' : 'start'}>
      {title}
    </DialogTitle>
  );
};

export const renderDescription = (
  description: React.ReactElement<typeof Trans> | string,
  enableDialogContent: boolean,
  textAlignCenter?: boolean,
) => {
  if (!enableDialogContent)
    return (
      <DialogContentText id="modal-description" textAlign={textAlignCenter ? 'center' : 'start'}>
        {description}
      </DialogContentText>
    );

  return (
    <DialogContent>
      <DialogContentText id="modal-description" textAlign={textAlignCenter ? 'center' : 'start'}>
        {description}
      </DialogContentText>
    </DialogContent>
  );
};

export const renderActionButton = (
  text: React.ReactElement<typeof Trans> | string,
  onClick?: () => void,
  variant: 'contained' | 'outlined' = 'contained',
  additionalProps?: Record<string, unknown>,
) => {
  if (!text) return null;

  return (
    <Button
      onClick={onClick}
      variant={variant}
      {...ACTION_BUTTON_PROPS}
      {...additionalProps}
      loadingPosition="end"
    >
      {text}
    </Button>
  );
};

export const ModalActions = (
  props:
    | {
        justify?: 'flex-start' | 'center' | 'flex-end';
        children?: ReactNode;
      }
    | undefined,
) => {
  const { justify = 'flex-end', children } = props || {};
  return (
    <DialogActions sx={{ justifyContent: justify, px: DIALOG_ACTIONS_PADDING_X }}>
      {children}
    </DialogActions>
  );
};
