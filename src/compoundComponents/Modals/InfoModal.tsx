import React from 'react';
import Modal from '@/components/Modal';
import { ModalActions, renderActionButton, renderDescription, renderTitle } from './modalRenderers';
import { Trans } from '@lingui/react';
import type { BaseModalProps } from '@/components/Modal';

interface InfoModalProps extends BaseModalProps {
  title?: React.ReactElement<typeof Trans> | string;
  description: React.ReactElement<typeof Trans> | string;
  textAlignCenter?: boolean;
  actionAlignment?: 'flex-start' | 'center' | 'flex-end';
  confirmText?: React.ReactElement<typeof Trans> | string;
  buttonDisabled?: boolean;
  children?: never;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  title,
  description,
  textAlignCenter = true,
  actionAlignment = 'center',
  confirmText = <Trans id="info.button" message="Got it" />,
  ...modalProps
}) => {
  return (
    <Modal {...modalProps}>
      {title && renderTitle(title, textAlignCenter)}
      {renderDescription(description, true, textAlignCenter)}
      <ModalActions justify={actionAlignment}>
        {renderActionButton(confirmText, modalProps.onClose, 'contained', {
          color: 'info',
        })}
      </ModalActions>
    </Modal>
  );
};
