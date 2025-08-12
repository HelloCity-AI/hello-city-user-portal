import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { InfoModal } from '@/compoundComponents/Modals';
import { renderWithThemeAndI18n } from '../utils/renderWithProviders';

const onCloseMock = jest.fn();
const defaultProps = {
  open: true,
  onClose: onCloseMock,
  description: 'Here is some important information for you to review.',
};

const renderInfoModal = (props: Record<string, unknown> = {}) =>
  renderWithThemeAndI18n(<InfoModal {...defaultProps} {...props} />);

describe('InfoModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI Style', () => {
    it('Displays title & description when provided', () => {
      renderInfoModal({ title: 'Important Information' });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByText('Here is some important information for you to review.'),
      ).toBeInTheDocument();
      expect(screen.getByText('Important Information')).toBeInTheDocument();
    });

    it('Displays default Got it button', () => {
      renderInfoModal();
      expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument();
    });

    it('Displays custom confirm button text', () => {
      renderInfoModal({ confirmText: 'Understood' });
      expect(screen.getByRole('button', { name: 'Understood' })).toBeInTheDocument();
    });

    it('Only shows one action button (no cancel button)', () => {
      renderInfoModal();

      expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });
  });

  describe('UX Interactions', () => {
    it('Calls onConfirm when confirm button is clicked (onConfirm provided)', async () => {
      renderInfoModal();
      await userEvent.click(screen.getByRole('button', { name: 'Got it' }));

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });
});
