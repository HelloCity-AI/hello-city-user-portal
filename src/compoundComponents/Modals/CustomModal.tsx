import React from 'react';
import Modal from '@/components/Modal';
import { renderDescription, renderTitle } from './modalRenderers';
import type { BaseModalProps } from '@/components/Modal';
import type { ReactNode } from 'react';
import type { Trans } from '@lingui/react';

interface CustomModalProps extends BaseModalProps {
  title?: React.ReactElement<typeof Trans> | string;
  description?: React.ReactElement<typeof Trans> | string;
  children: ReactNode;
  textAlignCenter?: boolean;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  maxWidth,
  fullWidth,
  fullScreen,
  hideBackdrop,
  disableBackdropClick,
  title,
  description,
  children,
  textAlignCenter,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      hideBackdrop={hideBackdrop}
      disableBackdropClick={disableBackdropClick}
    >
      {title && renderTitle(title, textAlignCenter)}
      {description && renderDescription(description, true, textAlignCenter)}
      {children}
    </Modal>
  );
};
