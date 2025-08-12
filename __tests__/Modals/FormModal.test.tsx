import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { FormModal } from '@/compoundComponents/Modals';
import { renderWithThemeAndI18n } from '../utils/renderWithProviders';

const onCloseMock = jest.fn();
const onSubmitMock = jest.fn((e) => e.preventDefault());
const defaultProps = {
  open: true,
  onClose: onCloseMock,
  onSubmit: onSubmitMock,
  children: (
    <div>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" type="email" />
      <textarea name="message" placeholder="Message" />
    </div>
  ),
};

const renderFormModal = (props: Record<string, unknown> = {}) =>
  renderWithThemeAndI18n(<FormModal {...defaultProps} {...props} />);

describe('FormModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI Style', () => {
    it('Renders form content correctly', () => {
      renderFormModal();
      expect(screen.getByTestId('form-modal-content')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
    });

    it('Displays title when provided', () => {
      renderFormModal({ title: 'Contact Form' });
      expect(screen.getByText('Contact Form')).toBeInTheDocument();
    });

    it('Displays description when provided', () => {
      renderFormModal({ description: 'Please fill out the form below.' });
      expect(screen.getByText('Please fill out the form below.')).toBeInTheDocument();
    });

    it('Renders without title when not provided', () => {
      renderFormModal();
      expect(screen.queryByText('Contact Form')).not.toBeInTheDocument();
    });

    it('Applies action alignment correctly', () => {
      renderFormModal({ actionAlignment: 'center' });

      const dialogActions = screen.getByRole('button', { name: 'Submit' }).parentElement;
      expect(dialogActions).toHaveStyle({ justifyContent: 'center' });
    });

    it('Centers text when textAlignCenter is true', () => {
      renderFormModal({ title: 'Contact Form', textAlignCenter: true });

      const title = screen.getByText('Contact Form');
      expect(title).toHaveStyle({ textAlign: 'center' });
    });
  });

  describe('UX Interactions', () => {
    it('Displays default submit and cancel buttons', () => {
      renderFormModal();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('Displays custom button text', () => {
      renderFormModal({ submitText: 'Send Message', cancelText: 'Discard' });
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument();
    });

    it('Calls onSubmit when submit button is clicked', async () => {
      renderFormModal({ onSubmit: onSubmitMock });

      await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });

    it('Calls onSubmit when form is submitted via Enter key', async () => {
      renderFormModal({ onSubmit: onSubmitMock });

      const nameInput = screen.getByPlaceholderText('Name');
      await userEvent.type(nameInput, 'John Doe');
      await userEvent.keyboard('{Enter}');

      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });

    it('Calls onClose when cancel button is clicked', async () => {
      renderFormModal({ onClose: onCloseMock });

      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('Form is properly wrapped in form element', () => {
      renderFormModal();

      const form = screen.getByRole('button', { name: 'Submit' }).closest('form');
      expect(form).toBeInTheDocument();
    });

    it('Disables submit button when buttonDisabled is true', () => {
      renderFormModal({ buttonDisabled: true });

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeEnabled();
    });

    it('Shows loading state on submit button', () => {
      renderFormModal({ buttonLoading: true });

      const submitButton = screen.getByRole('button', { name: 'Submit' });
      expect(submitButton).toBeInTheDocument();
    });
  });
});
