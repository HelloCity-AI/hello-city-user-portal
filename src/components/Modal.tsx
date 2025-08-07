'use client';
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/CloseRounded';
import IconButton from '@mui/material/IconButton';
import type {
  ModalProps,
  CustomModalProps,
  ConfirmModalProps,
  FormModalProps,
} from '@/types/Modal.types';
import type { Trans } from '@lingui/react';

const DIALOG_ACTIONS_PADDING_X = 2;
const ACTION_BUTTON_PROPS = {
  sx: {
    fontWeight: 600,
    minWidth: '100px',
  },
  color: 'primary',
} as const;

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen,
  hideBackdrop,
  disableBackdropClick,
  title,
  textAlignCenter,
  mode = 'custom',
  ...modeProps
}) => {
  const handleClose = (_event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (disableBackdropClick && reason === 'backdropClick') return;
    onClose();
  };

  const renderDescription = (description?: React.ReactElement<typeof Trans> | string) => {
    if (!description) return null;

    return (
      <DialogContentText id="modal-description" textAlign={textAlignCenter ? 'center' : 'start'}>
        {description}
      </DialogContentText>
    );
  };

  const renderActionButton = (
    text?: React.ReactElement<typeof Trans> | string,
    onClick?: () => void,
    variant: 'contained' | 'outlined' = 'contained',
    additionalProps?: Record<string, unknown>,
  ) => {
    if (!text) return null;
    return (
      <Button onClick={onClick} variant={variant} {...ACTION_BUTTON_PROPS} {...additionalProps}>
        {text}
      </Button>
    );
  };

  const renderConfirmModal = () => {
    const confirmProps = modeProps as ConfirmModalProps;
    const {
      description,
      actionAlignment = 'flex-end',
      onConfirm,
      confirmText,
      cancelText,
      buttonDisabled,
    } = confirmProps;

    return (
      <React.Fragment>
        <DialogContent data-testid="confirm-modal-content">
          {renderDescription(description)}
        </DialogContent>
        <DialogActions sx={{ justifyContent: actionAlignment, px: DIALOG_ACTIONS_PADDING_X }}>
          {renderActionButton(cancelText, onClose, 'outlined', { disabled: buttonDisabled })}
          {renderActionButton(confirmText, onConfirm, 'contained', {
            disabled: buttonDisabled,
          })}
        </DialogActions>
      </React.Fragment>
    );
  };

  const renderFormModal = () => {
    const formProps = modeProps as FormModalProps;
    const {
      description,
      children,
      onSubmit,
      submitText,
      cancelText,
      actionAlignment = 'flex-end',
      buttonDisabled,
    } = formProps;

    return (
      <form data-testid="form-modal-content" onSubmit={onSubmit}>
        <DialogContent>
          {renderDescription(description)}
          {children}
        </DialogContent>
        <DialogActions sx={{ justifyContent: actionAlignment, px: DIALOG_ACTIONS_PADDING_X }}>
          {renderActionButton(cancelText, onClose, 'outlined', { disabled: buttonDisabled })}
          {renderActionButton(submitText, undefined, 'contained', {
            type: 'submit',
            disabled: buttonDisabled,
          })}
        </DialogActions>
      </form>
    );
  };

  const renderCustomModal = () => {
    const customProps = modeProps as CustomModalProps;
    const { children, description } = customProps;

    return (
      <DialogContent data-testid="custom-modal-content">
        {renderDescription(description)}
        {children}
      </DialogContent>
    );
  };

  const renderModalContent = () => {
    switch (mode) {
      case 'confirm':
        return renderConfirmModal();
      case 'form':
        return renderFormModal();
      case 'custom':
        return renderCustomModal();
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      hideBackdrop={hideBackdrop}
      slotProps={{
        paper: {
          sx: {
            pt: 2,
            pb: 1.5,
          },
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        edge="start"
        disableTouchRipple
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          padding: 0.5,
        }}
      >
        <CloseIcon />
      </IconButton>
      {title && (
        <DialogTitle id="modal-title" variant="h4" textAlign={textAlignCenter ? 'center' : 'start'}>
          {title}
        </DialogTitle>
      )}
      {renderModalContent()}
    </Dialog>
  );
};

export default Modal;
