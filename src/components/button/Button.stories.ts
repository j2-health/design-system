import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
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
  },
}

export const Primary: Story = {
  args: {
    type: 'primary',
  },
}

export const Dashed: Story = {
  args: {
    type: 'dashed',
  },
}

export const Link: Story = {
  args: {
    type: 'link',
  },
}

export const Text: Story = {
  args: {
    type: 'text',
  },
}
