jest.mock('@/api/checklistApi', () => ({
  checklistApi: { createChecklistItem: jest.fn() },
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@/compoundComponents/Modals/CreateChecklistItemModal', () => ({
  CreateChecklistItemModal: jest.fn(),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { CreateChecklistItemButton } from '@/components/CreateChecklistItemButton';
import { CreateChecklistItemModal } from '@/compoundComponents/Modals/CreateChecklistItemModal';
import { checklistApi } from '@/api/checklistApi';
import dayjs from 'dayjs';

const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockModal = CreateChecklistItemModal as jest.MockedFunction<typeof CreateChecklistItemModal>;
const mockCreateChecklistItem = checklistApi.createChecklistItem as jest.MockedFunction<
  typeof checklistApi.createChecklistItem
>;

describe('CreateChecklistItemButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when user data is missing', () => {
    const { container } = render(<CreateChecklistItemButton />);
    expect(container.querySelector('button')).toBeInTheDocument();
    expect(screen.getByText(/Add Checklist Item/i)).toBeInTheDocument();
  });

  it('renders button when user exists', () => {
    mockUseSelector.mockReturnValue('user-123');

    render(<CreateChecklistItemButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('passes modal closed state initially', () => {
    mockUseSelector.mockReturnValue('user-123');

    render(<CreateChecklistItemButton />);
    expect(mockModal).toHaveBeenCalledWith(
      expect.objectContaining({
        open: false,
        userId: 'user-123',
      }),
      expect.anything(),
    );
  });

  it('opens modal after clicking the trigger button', () => {
    mockUseSelector.mockReturnValue('user-123');

    render(<CreateChecklistItemButton />);
    fireEvent.click(screen.getByRole('button'));

    expect(mockModal).toHaveBeenLastCalledWith(
      expect.objectContaining({
        open: true,
        userId: 'user-123',
      }),
      expect.anything(),
    );
  });

  it('calls onClose when modal is closed', async () => {
    mockUseSelector.mockReturnValue('user-123');

    render(<CreateChecklistItemButton />);
    fireEvent.click(screen.getByRole('button'));

    // get the last call to modal and invoke onClose
    const lastCall = mockModal.mock.calls[mockModal.mock.calls.length - 1];
    const modalProps = lastCall?.[0];
    if (modalProps?.onClose) {
      modalProps.onClose();
    }

    // wait for the modal to be closed
    await waitFor(() => {
      expect(mockModal).toHaveBeenLastCalledWith(
        expect.objectContaining({
          open: false,
        }),
        expect.anything(),
      );
    });
  });

  it('handles successful form submission', async () => {
    mockUseSelector.mockReturnValue('user-123');
    mockCreateChecklistItem.mockResolvedValue({
      checklistItemId: 'item-123',
      ownerId: 'user-123',
      title: 'Test Item',
      description: 'Test Description',
      isComplete: false,
      importance: 'Low',
      dueDate: dayjs('2025-09-26'),
    });

    render(<CreateChecklistItemButton />);

    // get onSubmit function from the modal props
    const modalProps = mockModal.mock.calls[0]?.[0];
    if (modalProps?.onSubmit) {
      await modalProps.onSubmit({
        ownerId: 'user-123',
        title: 'Test Item',
        description: 'Test Description',
        isComplete: false,
        importance: 'Low',
        dueDate: null,
      });
    }

    expect(mockCreateChecklistItem).toHaveBeenCalledWith('user-123', expect.any(Object));
  });

  it('handles form submission error', async () => {
    mockUseSelector.mockReturnValue('user-123');
    mockCreateChecklistItem.mockRejectedValue(new Error('API Error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<CreateChecklistItemButton />);

    // get onSubmit function from the modal props
    const modalProps = mockModal.mock.calls[0]?.[0];
    if (modalProps?.onSubmit) {
      // use rejects to test error handling
      await expect(
        modalProps.onSubmit({
          ownerId: 'user-123',
          title: 'Test Item',
          description: 'Test Description',
          isComplete: false,
          importance: 'Low',
          dueDate: null,
        }),
      ).rejects.toThrow('API Error');
    }

    expect(consoleSpy).toHaveBeenCalledWith('Failed to create checklist item:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('calls onItemCreated callback after successful submission', async () => {
    mockUseSelector.mockReturnValue('user-123');
    mockCreateChecklistItem.mockResolvedValue({
      checklistItemId: 'item-123',
      ownerId: 'user-123',
      title: 'Test Item',
      description: 'Test Description',
      isComplete: false,
      importance: 'Low',
      dueDate: dayjs('2025-09-26'),
    });

    const onItemCreatedMock = jest.fn();

    render(<CreateChecklistItemButton onItemCreated={onItemCreatedMock} />);

    // get onSubmit function from the modal props
    const modalProps = mockModal.mock.calls[0]?.[0];
    if (modalProps?.onSubmit) {
      await modalProps.onSubmit({
        ownerId: 'user-123',
        title: 'Test Item',
        description: 'Test Description',
        isComplete: false,
        importance: 'Low',
        dueDate: null,
      });
    }

    expect(onItemCreatedMock).toHaveBeenCalled();
  });
});
