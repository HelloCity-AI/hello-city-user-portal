import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Checkbox from '../components/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    placement: { control: 'radio', options: ['start', 'end'] },
    size: { control: 'radio', options: ['small', 'medium'] },
    color: { control: 'radio', options: ['default', 'primary', 'secondary', 'info'] },
    indeterminate: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
  args: {
    label: 'Checklist Item',
  },
};

export const Disabled: Story = {
  render: (args) => <Checkbox {...args} onChange={() => {}} />,
  args: {
    label: 'Disabled Item',
    disabled: true,
    checked: false,
  },
};

export const Indeterminate: Story = {
  render: (args) => <Checkbox {...args} onChange={() => {}} />,
  args: {
    label: 'Partially Selected (Indeterminate)',
    checked: false,
    indeterminate: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Checkbox label="Unchecked" checked={false} onChange={() => {}} />
      <Checkbox label="Checked" checked onChange={() => {}} />
      <Checkbox label="Indeterminate" checked={false} indeterminate onChange={() => {}} />
      <Checkbox label="Disabled Unchecked" checked={false} disabled onChange={() => {}} />
      <Checkbox label="Disabled Checked" checked disabled onChange={() => {}} />
    </div>
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
    const isIndeterminate = checkedCount > 0 && !isAllChecked;

    const handleSelectAll = () => {
      setItems(items.map((item) => ({ ...item, checked: !isAllChecked })));
    };

    const handleSelectOne = (id: string) => {
      setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          <Checkbox
            label={`Select All Tasks (${checkedCount}/${items.length} completed)`}
            checked={isAllChecked}
            indeterminate={isIndeterminate}
            onChange={handleSelectAll}
            color="primary"
          />
        </div>

        <div style={{ marginLeft: '24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              checked={item.checked}
              onChange={() => handleSelectOne(item.id)}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const LabelOnLeft: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <Checkbox {...args} checked={checked} onChange={(e) => setChecked(e.target.checked)} />;
  },
  args: {
    label: 'Label on the left',
    placement: 'start',
  },
};
