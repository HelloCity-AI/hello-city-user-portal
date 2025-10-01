import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { CreateChecklistItemButton } from '@/components/CreateChecklistItemButton';
import { CreateChecklistItemModal } from '@/compoundComponents/Modals/CreateChecklistItemModal';
import { checklistApi } from '@/api/checklistApi';
import dayjs from 'dayjs';
import type { CreateChecklistItemRequest } from '@/types/checkList.types';

jest.mock('@/api/checklistApi', () => ({
  checklistApi: { createChecklistItem: jest.fn() },
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@/compoundComponents/Modals/CreateChecklistItemModal', () => ({
  CreateChecklistItemModal: jest.fn(),
}));

const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockModal = CreateChecklistItemModal as jest.MockedFunction<typeof CreateChecklistItemModal>;
const mockCreateChecklistItem = checklistApi.createChecklistItem as jest.MockedFunction<
  typeof checklistApi.createChecklistItem
>;

describe('CreateChecklistItemButton', () => {
  let onSubmit: (data: CreateChecklistItemRequest) => Promise<void>;
  const defaultFormData: CreateChecklistItemRequest = {
    ownerId: 'user-123',
    title: 'Test Item',
    description: 'Test Description',
    isComplete: false,
    importance: 'Low',
    dueDate: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
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
    const modalProps = mockModal.mock.calls[0]?.[0];
    onSubmit = modalProps?.onSubmit as (data: CreateChecklistItemRequest) => Promise<void>;
  });

  it('renders button when user exists', () => {
    const buttons = screen.getAllByRole('button', { name: /Add Checklist Item/i });
    expect(buttons.length).toBe(1);
  });

  it('opens modal after clicking the trigger button', () => {
    const button = screen.getByRole('button', { name: /Add Checklist Item/i });
    fireEvent.click(button);
    expect(mockModal).toHaveBeenLastCalledWith(
      expect.objectContaining({
        open: true,
        userId: 'user-123',
      }),
      expect.anything(),
    );
  });

  it('calls onClose when modal is closed', async () => {
    const button = screen.getByRole('button', { name: /Add Checklist Item/i });
    fireEvent.click(button);
    const lastCall = mockModal.mock.calls[mockModal.mock.calls.length - 1];
    const modalProps = lastCall?.[0];
    if (modalProps?.onClose) {
      modalProps.onClose();
    }
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
    await onSubmit(defaultFormData);
    expect(mockCreateChecklistItem).toHaveBeenCalledWith('user-123', expect.any(Object));
  });

  it('handles form submission error', async () => {
    mockCreateChecklistItem.mockRejectedValue(new Error('API Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    await expect(onSubmit(defaultFormData)).rejects.toThrow('API Error');
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create checklist item:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('calls onItemCreated callback after successful submission', async () => {
    jest.clearAllMocks();
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
    const modalProps = mockModal.mock.calls[0]?.[0];
    const localOnSubmit = modalProps?.onSubmit as (data: CreateChecklistItemRequest) => Promise<void>;
    await localOnSubmit(defaultFormData);
    expect(onItemCreatedMock).toHaveBeenCalled();
  });
});
