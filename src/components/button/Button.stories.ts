import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Optimize Network',
    ghost: false,
    danger: false,
    type: 'default',
    shape: 'default',
  },
  argTypes: {
    onClick: { action: 'clicked' },
    type: {
      control: 'radio',
      options: ['default', 'primary', 'dashed', 'link', 'text'],
    },
    shape: {
      control: 'radio',
      options: ['default', 'round', 'circle'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'default',
    children: 'Optimize Network',
  },
}

export const Primary: Story = {
  args: {
    type: 'primary',
    children: 'Optimize Network',
  },
}

export const Dashed: Story = {
  args: {
    type: 'dashed',
    children: 'Optimize Network',
  },
}

export const Link: Story = {
  args: {
    type: 'link',
    children: 'Optimize Network',
  },
}

export const Text: Story = {
  args: {
    type: 'text',
    children: 'Optimize Network',
  },
}
