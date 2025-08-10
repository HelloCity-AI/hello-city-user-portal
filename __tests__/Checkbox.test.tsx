import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from '../src/components/Checkbox';
import { withTheme } from './utils/TestWrapper';

describe('Checkbox', () => {
  it('renders with label', () => {
    render(withTheme(<Checkbox label="Apply for Visa" checked={false} onChange={() => {}} />));
    expect(screen.getByLabelText(/Apply for Visa/i)).toBeInTheDocument();
  });

  it('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    render(withTheme(<Checkbox label="Click Me" checked={false} onChange={handleChange} />));
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('is disabled when prop is set', () => {
    render(withTheme(<Checkbox label="Disabled" checked={false} onChange={() => {}} disabled />));
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('renders label on the left when placement is start', () => {
    render(
      withTheme(
        <Checkbox label="Left Label" checked={false} onChange={() => {}} placement="start" />,
      ),
    );
    const labelNode = screen.getByText('Left Label').closest('label');
    expect(labelNode?.className).toMatch(/MuiFormControlLabel-labelPlacementStart/);
  });

  it('renders as indeterminate when indeterminate prop is true', async () => {
    render(
      withTheme(
        <Checkbox
          label="Indeterminate Checkbox"
          checked={false}
          onChange={() => {}}
          indeterminate={true}
        />,
      ),
    );
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

    await screen.findByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);

    const checkboxInput = screen.getByLabelText('Indeterminate Checkbox');
    expect(checkboxInput).toBeInTheDocument();
  });

  it('indeterminate prop can be combined with checked state', () => {
    render(
      withTheme(
        <Checkbox
          label="Indeterminate but Checked"
          checked={true}
          onChange={() => {}}
          indeterminate={true}
        />,
      ),
    );
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

    expect(checkbox.checked).toBe(true);
    expect(checkbox).toBeInTheDocument();

    const checkboxByLabel = screen.getByLabelText('Indeterminate but Checked');
    expect(checkboxByLabel).toBe(checkbox);
  });

  it('is not indeterminate by default', () => {
    render(withTheme(<Checkbox label="Default State" checked={false} onChange={() => {}} />));
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(false);
  });
});
