import type { ReactNode } from 'react';
import type { Trans } from '@lingui/react';

interface ModalCommonProps {
  open: boolean;
  onClose: () => void;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullScreen?: boolean;
  hideBackdrop?: boolean;
  disableBackdropClick?: boolean;
  title?: string;
  textAlignCenter?: boolean;
}

export interface ConfirmModalProps extends ModalCommonProps {
  mode: 'confirm';
  description: React.ReactElement<typeof Trans> | string;
  actionAlignment?: 'flex-start' | 'center' | 'flex-end';
  onConfirm: () => void;
  confirmText?: React.ReactElement<typeof Trans> | string;
  cancelText?: React.ReactElement<typeof Trans> | string;
  buttonDisabled?: boolean;
  children?: never;
  onSubmit?: never;
  submitText?: never;
}

export interface FormModalProps extends ModalCommonProps {
  mode: 'form';
  description?: React.ReactElement<typeof Trans> | string;
  children: ReactNode;
  actionAlignment?: 'flex-start' | 'center' | 'flex-end';
  onSubmit: (e: React.FormEvent) => void;
  submitText?: React.ReactElement<typeof Trans> | string;
  cancelText?: React.ReactElement<typeof Trans> | string;
  buttonDisabled?: boolean;
  onConfirm?: never;
  confirmText?: never;
}

export interface CustomModalProps extends ModalCommonProps {
  mode?: 'custom';
  description?: React.ReactElement<typeof Trans> | string;
  children?: ReactNode;
  actionAlignment?: never;
  onConfirm?: never;
  onSubmit?: never;
  confirmText?: never;
  submitText?: never;
  cancelText?: never;
  buttonDisabled?: never;
}

export type ModalProps = ConfirmModalProps | CustomModalProps | FormModalProps;

export type StrictModalProps =
  | (ConfirmModalProps & { mode: 'confirm' })
  | (FormModalProps & { mode: 'form' })
  | (CustomModalProps & { mode?: 'custom' });
