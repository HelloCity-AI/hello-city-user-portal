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
            borderRadius: 7,
            backgroundImage:
              'linear-gradient(to bottom right, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
        },
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.4)' },
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        edge="start"
        sx={{
          position: 'absolute',
          right: 12,
          top: 12,
          color: (theme) => theme.palette.grey[600],
          padding: 1,
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: 'rgb(59, 130, 246)',
            transform: 'scale(1.1)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      {children}
    </Dialog>
  );
};

export default Modal;
