import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomModal } from '@/compoundComponents/Modals';
import { renderWithThemeAndI18n } from '../utils/renderWithProviders';

const onCloseMock = jest.fn();

const defaultProps = {
  open: true,
  onClose: onCloseMock,
  children: (
    <div>
      <p data-testid="custom-content">This is custom content</p>
    </div>
  ),
};

const renderCustomModal = (props: Record<string, unknown> = {}) =>
  renderWithThemeAndI18n(<CustomModal {...defaultProps} {...props} />);

describe('CustomModal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Renders dialog and children content', () => {
    renderCustomModal();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('This is custom content')).toBeInTheDocument();
  });

  it('Renders title and description when provided', () => {
    renderCustomModal({ title: 'Custom Title', description: 'Custom description goes here.' });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description goes here.')).toBeInTheDocument();
  });
});
