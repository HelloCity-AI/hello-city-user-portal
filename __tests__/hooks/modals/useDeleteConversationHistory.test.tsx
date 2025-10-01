import { renderHook, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import useDeleteConversation from '@/hooks/modals/useDeleteConversationHistory';
import { renderWithThemeAndI18n } from '../../utils/renderWithProviders';
import React, { useEffect } from 'react';

const onDeleteMock = jest.fn();

// Extend window interface for test
interface WindowWithShowModal extends Window {
  showModal?: () => void;
}

declare const window: WindowWithShowModal;

// Test wrapper component to render hook with React 18 compatibility
const TestWrapper = ({ onDelete }: { onDelete: () => void }) => {
  const { show, ModalNode } = useDeleteConversation(onDelete);

  useEffect(() => {
    // Expose show function to test via window
    window.showModal = show;
  }, [show]);

  return <>{ModalNode}</>;
};

describe('useDeleteConversation Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete window.showModal;
  });

  describe('Hook Basic Functionality', () => {
    it('Returns show function and ModalNode', () => {
      const { result } = renderHook(() => useDeleteConversation(onDeleteMock));

      expect(result.current.show).toBeDefined();
      expect(typeof result.current.show).toBe('function');
      expect(result.current.ModalNode).toBeDefined();
    });

    it('Modal is not visible initially', () => {
      renderWithThemeAndI18n(<TestWrapper onDelete={onDeleteMock} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('Shows modal when show() is called', async () => {
      renderWithThemeAndI18n(<TestWrapper onDelete={onDeleteMock} />);

      await act(async () => {
        window.showModal?.();
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('Displays correct title and description', async () => {
      renderWithThemeAndI18n(<TestWrapper onDelete={onDeleteMock} />);

      await act(async () => {
        window.showModal?.();
      });

      await waitFor(() => {
        expect(screen.getByText('Delete Conversation')).toBeInTheDocument();
        expect(
          screen.getByText(
            'Are you sure you want to delete this conversation? This action cannot be undone.',
          ),
        ).toBeInTheDocument();
      });
    });

    it('Displays Delete and Cancel buttons', async () => {
      renderWithThemeAndI18n(<TestWrapper onDelete={onDeleteMock} />);

      await act(async () => {
        window.showModal?.();
      });

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      });
    });

    it('Modal has isWarning prop set to true', async () => {
      renderWithThemeAndI18n(<TestWrapper onDelete={onDeleteMock} />);

      await act(async () => {
        window.showModal?.();
      });

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', { name: 'Delete' });
        expect(deleteButton).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('Calls onDelete and closes modal when Delete is clicked', async () => {
      renderWithThemeAndI18n(<TestWrapper onDelete={onDeleteMock} />);

      await act(async () => {
        window.showModal?.();
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      await userEvent.click(deleteButton);

      expect(onDeleteMock).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('Closes modal without calling onDelete when Cancel is clicked', async () => {
      renderWithThemeAndI18n(<TestWrapper onDelete={onDeleteMock} />);

      await act(async () => {
        window.showModal?.();
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);

      expect(onDeleteMock).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('Can show modal multiple times after closing', async () => {
      renderWithThemeAndI18n(<TestWrapper onDelete={onDeleteMock} />);

      // First show and cancel
      await act(async () => {
        window.showModal?.();
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await userEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Second show
      await act(async () => {
        window.showModal?.();
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('Does not call onDelete multiple times', async () => {
      renderWithThemeAndI18n(<TestWrapper onDelete={onDeleteMock} />);

      await act(async () => {
        window.showModal?.();
      });

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      await userEvent.click(deleteButton);

      // Should only be called once because modal closes after first click
      expect(onDeleteMock).toHaveBeenCalledTimes(1);
    });
  });
});
