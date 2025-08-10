import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Checkbox from '../components/Checkbox';
import websiteTheme from '../theme/theme';
import { ThemeProvider } from '@emotion/react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    placement: { control: 'radio', options: ['start', 'end'] },
    size: { control: 'radio', options: ['small', 'medium'] },
    color: { control: 'radio', options: ['default', 'primary', 'secondary', 'info'] },
    indeterminate: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <ThemeProvider theme={websiteTheme}>
        <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />
      </ThemeProvider>
    );
  },
  args: {
    label: 'Checklist Item',
    placement: 'end',
    size: 'medium',
    color: 'primary',
    disabled: false,
    indeterminate: false,
  },
};

export const Disabled: Story = {
  render: (args) => (
    <ThemeProvider theme={websiteTheme}>
      <Checkbox {...args} onChange={() => {}} />
    </ThemeProvider>
  ),
  args: {
    label: 'Disabled Item',
    disabled: true,
    placement: 'end',
    size: 'medium',
    color: 'primary',
    checked: false,
    indeterminate: false,
  },
};

export const Indeterminate: Story = {
  render: (args) => (
    <ThemeProvider theme={websiteTheme}>
      <Checkbox {...args} onChange={() => {}} />
    </ThemeProvider>
  ),
  args: {
    label: 'Partially Selected (Indeterminate)',
    checked: false,
    indeterminate: true,
    placement: 'end',
    size: 'medium',
    color: 'primary',
    disabled: false,
  },
};

export const AllStates: Story = {
  render: () => (
    <ThemeProvider theme={websiteTheme}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Checkbox label="Unchecked" checked={false} indeterminate={false} onChange={() => {}} />
        <Checkbox label="Checked" checked={true} indeterminate={false} onChange={() => {}} />
        <Checkbox label="Indeterminate" checked={false} indeterminate={true} onChange={() => {}} />
        <Checkbox
          label="Disabled Unchecked"
          checked={false}
          indeterminate={false}
          disabled={true}
          onChange={() => {}}
        />
        <Checkbox
          label="Disabled Checked"
          checked={true}
          indeterminate={false}
          disabled={true}
          onChange={() => {}}
        />
      </div>
    </ThemeProvider>
  ),
};

export const HierarchicalChecklist: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: '1', label: 'Complete Application Form', checked: true },
      { id: '2', label: 'Upload Required Documents', checked: false },
      { id: '3', label: 'Pay Application Fee', checked: true },
      { id: '4', label: 'Schedule Interview', checked: false },
    ]);

    const checkedCount = items.filter((item) => item.checked).length;
    const isAllChecked = checkedCount === items.length;
    const isIndeterminate = checkedCount > 0 && checkedCount < items.length;

    const handleSelectAll = () => {
      const newCheckedState = !isAllChecked;
      setItems(items.map((item) => ({ ...item, checked: newCheckedState })));
    };

    const handleItemChange = (id: string) => {
      setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
    };

    return (
      <ThemeProvider theme={websiteTheme}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            <Checkbox
              label={`Select All Tasks (${checkedCount}/${items.length} completed)`}
              checked={isAllChecked}
              indeterminate={isIndeterminate}
              onChange={handleSelectAll}
              color="primary"
            />
          </div>

          <div style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {items.map((item) => (
              <Checkbox
                key={item.id}
                label={item.label}
                checked={item.checked}
                indeterminate={false}
                onChange={() => handleItemChange(item.id)}
                color="secondary"
                size="small"
              />
            ))}
          </div>
        </div>
      </ThemeProvider>
    );
  },
};

export const LabelOnLeft: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return (
      <ThemeProvider theme={websiteTheme}>
        <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />
      </ThemeProvider>
    );
  },
  args: {
    label: 'Label on the left',
    placement: 'start',
    size: 'small',
    color: 'secondary',
  },
};
