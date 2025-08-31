import React from 'react';
import Modal from '@/components/Modal';
import { ModalActions, renderActionButton, renderDescription, renderTitle } from './modalRenderers';
import type { BaseModalProps } from '@/components/Modal';
import { Trans } from '@lingui/react';

interface ConfirmModalProps extends BaseModalProps {
  title?: React.ReactElement<typeof Trans> | string;
  description: React.ReactElement<typeof Trans> | string;
  textAlignCenter?: boolean;
  actionAlignment?: 'flex-start' | 'center' | 'flex-end';
  onConfirm: () => void;
  confirmText?: React.ReactElement<typeof Trans> | string;
  cancelText?: React.ReactElement<typeof Trans> | string;
  buttonDisabled?: boolean;
  buttonLoading?: boolean;
  isWarning?: boolean;
  children?: never;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  description,
  textAlignCenter,
  actionAlignment = 'flex-end',
  onConfirm,
  confirmText = <Trans id="confirm.button" message="Confirm" />,
  cancelText = <Trans id="cancel.button" message="Cancel" />,
  buttonDisabled,
  buttonLoading,
  isWarning,
  ...modalProps
}) => {
  return (
    <Modal {...modalProps} disableBackdropClick={modalProps.disableBackdropClick || isWarning}>
      {title && renderTitle(title, textAlignCenter)}
      {renderDescription(description, true, textAlignCenter)}
      <ModalActions justify={actionAlignment}>
        {renderActionButton(cancelText, modalProps.onClose, 'outlined')}
        {renderActionButton(confirmText, onConfirm, 'contained', {
          disabled: buttonDisabled,
          color: isWarning ? 'warning' : 'primary',
          loading: buttonLoading,
        })}
      </ModalActions>
    </Modal>
  );
};
