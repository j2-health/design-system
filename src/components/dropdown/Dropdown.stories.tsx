import type { Meta, StoryObj } from '@storybook/react'

import { Dropdown } from './Dropdown'

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'radio',
      options: ['basic', 'twofold', 'basic-inline'],
    },
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Dropdown',
    type: 'basic',
  },
  render: (args) => {
    return (
      <Dropdown {...args} menu={{ items: [{ key: '1', label: 'Item 1' }] }} />
    )
  },
}

export const Twofold: Story = {
  args: {
    label: 'Click me!',
    type: 'twofold',
  },
  render: (args) => {
    return (
      <Dropdown {...args} menu={{ items: [{ key: '1', label: 'Item 1' }] }} />
    )
  },
}

export const BasicInline: Story = {
  args: {
    label: 'Dropdown',
    type: 'basic-inline',
  },
  render: (args) => {
    return (
      <Dropdown {...args} menu={{ items: [{ key: '1', label: 'Item 1' }] }} />
    )
  },
}
