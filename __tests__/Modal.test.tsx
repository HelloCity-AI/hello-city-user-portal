import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Modal from '@/components/Modal';
import renderWithTheme from './utils/renderWithTheme';
import type { ConfirmModalProps, FormModalProps, CustomModalProps } from '@/types/Modal.types';

const modalTitles = {
  confirm: 'Confirm Action',
  form: 'Contact Form',
  custom: 'Custom Modal',
} as const;

const modalDescriptions = {
  confirm: 'Are you sure you want to proceed?',
  form: 'Please fill out the form below',
  custom: 'This is a custom modal',
} as const;

const buttonTexts = {
  confirm: 'Yes, Confirm',
  cancel: 'Cancel',
  submit: 'Send Message',
} as const;

const onCloseMock = jest.fn();
const onConfirmMock = jest.fn();
const onSubmitMock = jest.fn((e) => e.preventDefault());

const testFormContent = (
  <div>
    <input name="name" placeholder="Name" />
    <input name="email" placeholder="Email" type="email" />
    <textarea name="message" placeholder="Message" />
  </div>
);

const testCustomContent = (
  <div>
    <h3>Custom Content</h3>
    <button>Custom Button</button>
  </div>
);

const createBaseProps = (overrides = {}) => ({
  open: true,
  onClose: jest.fn(),
  ...overrides,
});

const createConfirmProps = (overrides = {}): ConfirmModalProps => ({
  ...createBaseProps(),
  mode: 'confirm' as const,
  title: modalTitles.confirm,
  description: modalDescriptions.confirm,
  onConfirm: jest.fn(),
  confirmText: buttonTexts.confirm,
  cancelText: buttonTexts.cancel,
  ...overrides,
});

const createFormProps = (overrides = {}): FormModalProps => ({
  ...createBaseProps(),
  mode: 'form' as const,
  title: modalTitles.form,
  description: modalDescriptions.form,
  onSubmit: jest.fn(),
  submitText: buttonTexts.submit,
  cancelText: buttonTexts.cancel,
  children: testFormContent,
  ...overrides,
});

const createCustomProps = (overrides = {}): CustomModalProps => ({
  ...createBaseProps(),
  mode: 'custom' as const,
  title: modalTitles.custom,
  description: modalDescriptions.custom,
  children: testCustomContent,
  ...overrides,
});

const renderModal = (mode: 'custom' | 'form' | 'confirm' = 'custom', overrides = {}) => {
  const props = (() => {
    switch (mode) {
      case 'custom':
        return createCustomProps(overrides);
      case 'form':
        return createFormProps(overrides);
      case 'confirm':
        return createConfirmProps(overrides);
      default:
        return createCustomProps(overrides);
    }
  })();

  return renderWithTheme(<Modal {...props} />);
};

describe('Modal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic UI Style', () => {
    describe('Modal Rendering', () => {
      it('Renders when open is true', () => {
        renderModal('custom');
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      it('Does not render when open is false', () => {
        renderModal('custom', { open: false });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      it('Manages focus correctly when modal opens', () => {
        renderModal();

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('role', 'dialog');
      });
    });

    describe('Title and Description Display', () => {
      it('Displays title and description correctly', () => {
        renderModal();

        expect(screen.getByText(modalTitles.custom)).toBeInTheDocument();
        expect(screen.getByText(modalDescriptions.custom)).toBeInTheDocument();
      });

      it('Renders without title when not provided', () => {
        renderModal('custom', { title: undefined });

        expect(screen.queryByText(modalTitles.custom)).not.toBeInTheDocument();
        expect(screen.getByText('Custom Content')).toBeInTheDocument();
      });

      it('Renders without description when not provided', () => {
        renderModal('custom', { description: undefined });

        expect(screen.getByText(modalTitles.custom)).toBeInTheDocument();
        expect(screen.queryByText(modalDescriptions.custom)).not.toBeInTheDocument();
      });
    });

    describe('Size and Layout Configuration', () => {
      it('Applies maxWidth prop "sm" as default value', () => {
        renderModal('custom');
        expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperWidthSm');
      });

      it('Applies maxWidth prop correctly', () => {
        renderModal('custom', { maxWidth: 'lg' });
        expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperWidthLg');
      });

      it('Applies fullWidth prop correctly', () => {
        renderModal('custom', { fullWidth: true });
        expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperFullWidth');
      });

      it('Applies fullScreen prop correctly', () => {
        renderModal('custom', { fullScreen: true });
        expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperFullScreen');
      });

      it('Centers text when textAlignCenter is true', () => {
        renderModal('custom', { textAlignCenter: true });
        expect(screen.getByText(modalTitles.custom)).toHaveStyle({ textAlign: 'center' });
      });
    });

    describe('Backdrop Configuration', () => {
      it('Renders with backdrop by default', () => {
        renderModal('custom');
        expect(document.querySelector('.MuiBackdrop-root')).toBeInTheDocument();
      });

      it('Applies hideBackdrop configuration', () => {
        renderModal('custom', { hideBackdrop: true });
        expect(document.querySelector('.MuiBackdrop-root')).not.toBeInTheDocument();
      });
    });

    describe('Button Text Customization', () => {
      it('Displays custom confirm button text', () => {
        const customText = 'Custom Confirm';
        renderModal('confirm', { confirmText: customText });

        expect(screen.getByRole('button', { name: customText })).toBeInTheDocument();
      });

      it('Displays custom cancel button text', () => {
        const customText = 'Custom Cancel';
        renderModal('confirm', { cancelText: customText });

        expect(screen.getByRole('button', { name: customText })).toBeInTheDocument();
      });

      it('Hide cancel button when text is empty', () => {
        const customText = '';
        renderModal('confirm', { cancelText: customText });

        expect(screen.getByRole('button', { name: buttonTexts.confirm })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: buttonTexts.cancel })).not.toBeInTheDocument();
      });

      it('Displays custom submit button text', () => {
        const customText = 'Custom Submit';
        renderModal('form', { submitText: customText });

        expect(screen.getByRole('button', { name: customText })).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions & Modes', () => {
    describe('General Close Dialog Action', () => {
      it('Calls onClose when close button is clicked', async () => {
        renderModal('custom', { onClose: onCloseMock });

        await userEvent.click(screen.getByRole('button', { name: /close/i }));

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it('Calls onClose when backdrop is clicked', async () => {
        const { baseElement } = renderModal('custom', { onClose: onCloseMock });

        const backdrop = baseElement.querySelector('.MuiBackdrop-root');
        if (backdrop) {
          fireEvent.click(backdrop);
        }

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it('Does not call onClose when backdrop is clicked and disableBackdropClick is true', async () => {
        const { baseElement } = renderModal('custom', {
          onClose: onCloseMock,
          disableBackdropClick: true,
        });

        const backdrop = baseElement.querySelector('.MuiBackdrop-root');
        expect(backdrop).toBeInTheDocument();
        if (backdrop) fireEvent.click(backdrop);

        expect(onCloseMock).not.toHaveBeenCalled();
      });

      it('Calls onClose when ESC key is pressed', async () => {
        renderModal('custom', { onClose: onCloseMock });

        await userEvent.keyboard('{Escape}');

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('Confirm Mode', () => {
      it('Renders confirm modal with correct elements', () => {
        renderModal('confirm');

        expect(screen.getByTestId('confirm-modal-content')).toBeInTheDocument();
        expect(screen.getByText(modalTitles.confirm)).toBeInTheDocument();
        expect(screen.getByText(modalDescriptions.confirm)).toBeInTheDocument();
      });

      it('Calls onConfirm when confirm button is clicked', async () => {
        renderModal('confirm', { onConfirm: onConfirmMock });

        await userEvent.click(screen.getByRole('button', { name: buttonTexts.confirm }));

        expect(onConfirmMock).toHaveBeenCalledTimes(1);
      });

      it('Calls onClose when cancel button is clicked', async () => {
        renderModal('confirm', { onClose: onCloseMock });

        await userEvent.click(screen.getByRole('button', { name: buttonTexts.cancel }));

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it('Applies action alignment correctly in confirm', () => {
        renderModal('confirm', { actionAlignment: 'center' });

        const dialogActions = screen.getByRole('button', {
          name: buttonTexts.confirm,
        }).parentElement;
        expect(dialogActions).toHaveStyle({ justifyContent: 'center' });
      });

      it('Applies buttonDisabled correctly in confirm', () => {
        renderModal('confirm', { buttonDisabled: true });

        const confirmButton = screen.getByRole('button', { name: buttonTexts.confirm });
        const cancelButton = screen.getByRole('button', { name: buttonTexts.cancel });

        expect(confirmButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();
      });
    });

    describe('Form Mode', () => {
      it('Renders form modal with correct elements', () => {
        renderModal('form');

        expect(screen.getByTestId('form-modal-content')).toBeInTheDocument();
        expect(screen.getByText(modalTitles.form)).toBeInTheDocument();
        expect(screen.getByText(modalDescriptions.form)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
      });

      it('Calls onSubmit when submit button is clicked', async () => {
        renderModal('form', { onSubmit: onSubmitMock });

        await userEvent.click(screen.getByRole('button', { name: buttonTexts.submit }));

        expect(onSubmitMock).toHaveBeenCalledTimes(1);
      });

      it('Calls onSubmit when form is submitted via Enter key', async () => {
        renderModal('form', { onSubmit: onSubmitMock });

        const nameInput = screen.getByPlaceholderText('Name');
        await userEvent.type(nameInput, 'John Doe');
        await userEvent.keyboard('{Enter}');

        expect(onSubmitMock).toHaveBeenCalledTimes(1);
      });

      it('Calls onClose when cancel button is clicked', async () => {
        renderModal('form', { onClose: onCloseMock });

        await userEvent.click(screen.getByRole('button', { name: buttonTexts.cancel }));

        expect(onCloseMock).toHaveBeenCalledTimes(1);
      });

      it('Form is properly wrapped in form element', () => {
        renderModal('form');

        const form = screen.getByRole('button', { name: buttonTexts.submit }).closest('form');
        expect(form).toBeInTheDocument();
      });

      it('Applies action alignment correctly in form mode', () => {
        renderModal('form', { actionAlignment: 'flex-start' });

        const dialogActions = screen.getByRole('button', {
          name: buttonTexts.submit,
        }).parentElement;
        expect(dialogActions).toHaveStyle({ justifyContent: 'flex-start' });
      });

      it('Applies buttonDisabled correctly in form', () => {
        renderModal('form', { buttonDisabled: true });

        const submitButton = screen.getByRole('button', { name: buttonTexts.submit });
        const cancelButton = screen.getByRole('button', { name: buttonTexts.cancel });

        expect(submitButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();
      });
    });

    describe('Custom Mode', () => {
      it('Renders custom modal as default mode value with correct elements', () => {
        renderModal('custom');

        expect(screen.getByText(modalTitles.custom)).toBeInTheDocument();
        expect(screen.getByText(modalDescriptions.custom)).toBeInTheDocument();
        expect(screen.getByText('Custom Content')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument();
      });

      it('Only renders close button for actions', () => {
        renderModal('custom');

        const closeButton = screen.getByRole('button', { name: /close/i });
        expect(closeButton).toBeInTheDocument();

        expect(screen.queryByRole('button', { name: buttonTexts.confirm })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: buttonTexts.cancel })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: buttonTexts.submit })).not.toBeInTheDocument();
      });
    });
  });
});
