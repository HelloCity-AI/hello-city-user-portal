import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import Modal from '@/components/Modal';
import { ModalActions, renderActionButton, renderDescription, renderTitle } from './modalRenderers';
import { Trans } from '@lingui/react';
import type { BaseModalProps } from '@/components/Modal';
import type { ReactNode } from 'react';

interface FormModalProps extends BaseModalProps {
  title?: React.ReactElement<typeof Trans> | string;
  description?: React.ReactElement<typeof Trans> | string;
  children: ReactNode;
  textAlignCenter?: boolean;
  actionAlignment?: 'flex-start' | 'center' | 'flex-end';
  onSubmit: (e: React.FormEvent) => void;
  submitText?: React.ReactElement<typeof Trans> | string;
  cancelText?: React.ReactElement<typeof Trans> | string;
  buttonDisabled?: boolean;
  buttonLoading?: boolean;
}

export const FormModal: React.FC<FormModalProps> = ({
  title,
  description,
  children,
  textAlignCenter,
  actionAlignment = 'flex-end',
  onSubmit,
  submitText = <Trans id="Submit">Submit</Trans>,
  cancelText = <Trans id="Cancel">Cancel</Trans>,
  buttonDisabled,
  buttonLoading,
  ...modalProps
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Modal {...modalProps} disableBackdropClick={modalProps.disableBackdropClick ?? true}>
      {title && renderTitle(title, textAlignCenter)}
      <form data-testid="form-modal-content" onSubmit={handleSubmit}>
        <DialogContent>
          {description && renderDescription(description, false, textAlignCenter)}
          {children}
        </DialogContent>
        <ModalActions justify={actionAlignment}>
          {renderActionButton(cancelText, modalProps.onClose, 'outlined')}
          {renderActionButton(submitText, undefined, 'contained', {
            type: 'submit',
            disabled: buttonDisabled,
            loading: buttonLoading,
            color: 'primary',
          })}
        </ModalActions>
      </form>
    </Modal>
  );
};
