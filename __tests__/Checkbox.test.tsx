import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from '../src/components/Checkbox';
import { withTheme } from './utils/TestWrapper';

describe('Checkbox', () => {
  // Helper function to render Checkbox with theme
  const renderCheckbox = (props: React.ComponentProps<typeof Checkbox>) => {
    return render(withTheme(<Checkbox {...props} />));
  };

  it('Renders with label', () => {
    renderCheckbox({ label: 'Apply for Visa', checked: false, onChange: () => {} });
    expect(screen.getByLabelText(/Apply for Visa/i)).toBeInTheDocument();
  });

  it('Calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    renderCheckbox({ label: 'Click Me', checked: false, onChange: handleChange });
    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('Is disabled when prop is set', () => {
    renderCheckbox({ label: 'Disabled', checked: false, onChange: () => {}, disabled: true });
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('Renders label on the left when placement is start', () => {
    renderCheckbox({
      label: 'Left Label',
      checked: false,
      onChange: () => {},
      placement: 'start',
    });
    const labelNode = screen.getByText('Left Label').closest('label');
    expect(labelNode?.className).toMatch(/MuiFormControlLabel-labelPlacementStart/);
  });

  it('Renders as indeterminate when indeterminate prop is true', async () => {
    renderCheckbox({
      label: 'Indeterminate Checkbox',
      checked: false,
      onChange: () => {},
      indeterminate: true,
    });

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('data-indeterminate', 'true');
  });

  it('Indeterminate prop can be combined with checked state', () => {
    renderCheckbox({
      label: 'Indeterminate but Checked',
      checked: true,
      onChange: () => {},
      indeterminate: true,
    });
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

    expect(checkbox.checked).toBe(true);
    expect(checkbox).toBeInTheDocument();

    const checkboxByLabel = screen.getByLabelText('Indeterminate but Checked');
    expect(checkboxByLabel).toBe(checkbox);
  });

  it('Is not indeterminate by default', () => {
    renderCheckbox({ label: 'Default State', checked: false, onChange: () => {} });
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(false);
  });
});
