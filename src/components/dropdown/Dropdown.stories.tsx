import type { Meta, StoryObj } from '@storybook/react'

import { Dropdown } from './Dropdown'

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  args: {
    arrow: false,
    disabled: false,
    trigger: ['click'],
    placement: 'bottom',
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['basic', 'twofold', 'basic-inline'],
    },
    trigger: {
      control: 'check',
      options: ['click', 'hover'],
    },
    placement: {
      control: 'radio',
      options: [
        'bottom',
        'top',
        'bottomLeft',
        'bottomRight',
        'topLeft',
        'topRight',
      ],
    },
    arrow: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Download Report',
    type: 'basic',
  },
  render: (args) => {
    return (
      <Dropdown
        {...args}
        menu={{ items: [{ key: 'csv', label: 'CSV Report' }] }}
      />
    )
  },
}

export const Twofold: Story = {
  args: {
    label: 'Click to Download',
    type: 'twofold',
  },
  render: (args) => {
    return (
      <Dropdown
        {...args}
        menu={{ items: [{ key: 'csv', label: 'CSV Report' }] }}
      />
    )
  },
}

export const BasicInline: Story = {
  args: {
    label: 'Export Data',
    type: 'basic-inline',
  },
  render: (args) => {
    return (
      <Dropdown
        {...args}
        menu={{ items: [{ key: 'csv', label: 'CSV Report' }] }}
      />
    )
  },
}
