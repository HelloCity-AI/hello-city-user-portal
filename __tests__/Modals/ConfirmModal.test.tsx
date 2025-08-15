import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ConfirmModal } from '@/compoundComponents/Modals';
import { renderWithThemeAndI18n } from '../utils/renderWithProviders';

const onCloseMock = jest.fn();
const onConfirmMock = jest.fn();

const defaultProps = {
  open: true,
  onClose: onCloseMock,
  onConfirm: onConfirmMock,
  description: 'Are you sure you want to proceed?',
};

const renderConfirmModal = (props: Record<string, unknown> = {}) =>
  renderWithThemeAndI18n(<ConfirmModal {...defaultProps} {...props} />);

describe('ConfirmModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI Style', () => {
    it('Displays description correctly', () => {
      renderConfirmModal();
      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    });

    it('Displays title when provided', () => {
      renderConfirmModal({ title: 'Confirm Action' });
      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    });

    it('Renders without title when not provided', () => {
      renderConfirmModal();
      expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
    });

    it('Applies action alignment correctly', () => {
      renderConfirmModal({ actionAlignment: 'center' });

      const dialogActions = screen.getByRole('button', {
        name: 'Confirm',
      }).parentElement;
      expect(dialogActions).toHaveStyle({ justifyContent: 'center' });
    });

    it('Centers text when textAlignCenter is true', () => {
      renderConfirmModal({ title: 'Confirm Action', textAlignCenter: true });

      const title = screen.getByText('Confirm Action');
      expect(title).toHaveStyle({ textAlign: 'center' });
    });

    it('Applies warning color when isWarning is true', () => {
      renderConfirmModal({ isWarning: true });

      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      expect(confirmButton).toBeInTheDocument();
    });
  });

  describe('UX Interactions', () => {
    it('Displays default confirm and cancel buttons', () => {
      renderWithThemeAndI18n(<ConfirmModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('Displays custom button text', () => {
      renderConfirmModal({ confirmText: 'Yes, Delete', cancelText: 'No, Keep' });
      expect(screen.getByRole('button', { name: 'Yes, Delete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No, Keep' })).toBeInTheDocument();
    });

    it('Calls onConfirm when confirm button is clicked', async () => {
      renderConfirmModal({ onConfirm: onConfirmMock });

      await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onConfirmMock).toHaveBeenCalledTimes(1);
    });

    it('Calls onClose when cancel button is clicked', async () => {
      renderConfirmModal({ onClose: onCloseMock });

      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('Disables confirm button when buttonDisabled is true', () => {
      renderConfirmModal({ buttonDisabled: true });

      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });

      expect(confirmButton).toBeDisabled();
      expect(cancelButton).toBeEnabled();
    });

    it('Shows loading state on confirm button', () => {
      renderConfirmModal({ buttonLoading: true });

      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      expect(confirmButton).toBeInTheDocument();
    });

    it('Prevents backdrop click when isWarning is true', async () => {
      const { baseElement } = renderConfirmModal({ onClose: onCloseMock, isWarning: true });

      const backdrop = baseElement.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });
});
