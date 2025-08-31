import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Modal from '@/components/Modal';
import { renderWithThemeAndI18n } from '../utils/renderWithProviders';

const onCloseMock = jest.fn();
const defaultProps = {
  open: true,
  onClose: onCloseMock,
  children: (
    <div>
      <h3>Custom Content</h3>
      <p>This is custom modal content</p>
    </div>
  ),
};

const renderBaseModal = (props: Record<string, unknown> = {}) =>
  renderWithThemeAndI18n(<Modal {...defaultProps} {...props} />);

describe('Modal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('Renders when open is true', () => {
      renderBaseModal();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('Does not render when open is false', () => {
      renderBaseModal({ open: false });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('Renders custom content correctly', () => {
      renderBaseModal();
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
      expect(screen.getByText('This is custom modal content')).toBeInTheDocument();
    });

    it('Applies maxWidth "sm" as default', () => {
      renderBaseModal();
      expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperWidthSm');
    });

    it('Applies custom maxWidth correctly', () => {
      renderBaseModal({ maxWidth: 'lg' });
      expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperWidthLg');
    });

    it('Applies fullWidth correctly', () => {
      renderBaseModal({ fullWidth: true });
      expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperFullWidth');
    });

    it('Applies fullScreen correctly', () => {
      renderBaseModal({ fullScreen: true });
      expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperFullScreen');
    });

    it('Hides backdrop when hideBackdrop is true', () => {
      renderBaseModal({ hideBackdrop: true });
      expect(document.querySelector('.MuiBackdrop-root')).not.toBeInTheDocument();
    });
  });

  describe('Close Interactions', () => {
    it('Calls onClose when close button is clicked', async () => {
      renderBaseModal({ onClose: onCloseMock });

      await userEvent.click(screen.getByRole('button', { name: /close/i }));

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('Calls onClose when ESC key is pressed', async () => {
      renderBaseModal({ onClose: onCloseMock });

      await userEvent.keyboard('{Escape}');

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('Calls onClose when backdrop is clicked by default', async () => {
      const { baseElement } = renderBaseModal({ onClose: onCloseMock });

      const backdrop = baseElement.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('Prevents backdrop click when disableBackdropClick is true', async () => {
      const { baseElement } = renderBaseModal({ onClose: onCloseMock, disableBackdropClick: true });

      const backdrop = baseElement.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      expect(onCloseMock).not.toHaveBeenCalled();
    });
  });
});
