import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    size: {
      control: 'radio',
      options: ['large', 'middle', 'small'],
    },
    mode: {
      control: 'radio',
      options: { default: '', multiple: 'multiple' },
    },
    allowClear: {
      control: 'boolean',
    },
    onChange: { action: 'changed' },
  },
  args: {
    size: 'middle',
    options: [
      { label: 'Bronze Plan', value: 'bronze' },
      { label: 'Silver Plan', value: 'silver' },
      { label: 'Gold Plan', value: 'gold' },
      { label: 'Platinum Plan', value: 'platinum' },
    ],
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    size: 'middle',
    defaultValue: 'bronze',
  },
}

export const Search: Story = {
  args: {
    size: 'middle',
    showSearch: true,
    placeholder: 'Select a health care plan',
    optionFilterProp: 'label',
    allowClear: true,
    onChange: { action: 'changed' },
    onSearch: { action: 'searched' },
    options: [
      { value: 'bronze', label: 'Bronze Plan' },
      { value: 'silver', label: 'Silver Plan' },
      { value: 'gold', label: 'Gold Plan' },
      { value: 'platinum', label: 'Platinum Plan' },
    ],
  },
}

export const Multiple: Story = {
  args: {
    size: 'middle',
    mode: 'multiple',
    placeholder: 'Select health care plans',
    defaultValue: ['bronze', 'gold'],
    allowClear: true,
  },
}
