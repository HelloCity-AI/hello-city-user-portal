'use client';
import React from 'react';
import CloseIcon from '@mui/icons-material/CloseRounded';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import type { ReactNode } from 'react';

export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
  hideBackdrop?: boolean;
  disableBackdropClick?: boolean;
}

const Modal: React.FC<BaseModalProps> = ({
  open,
  onClose,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen,
  hideBackdrop,
  disableBackdropClick,
}) => {
  const handleClose = (_event: object, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (disableBackdropClick && reason === 'backdropClick') return;
    onClose();
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
        backdrop: {
          sx: { backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' },
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
      {children}
    </Dialog>
  );
};

export default Modal;
