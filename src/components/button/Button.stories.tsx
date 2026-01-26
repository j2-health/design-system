import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './Button'
import { ChefHatIcon } from '@phosphor-icons/react'

const meta = {
  title: 'Components/Button',
  parameters: {
    layout: 'fullscreen',
  },
  component: Button,
  decorators: [
    (Story, context) => {
      const backgroundColor = context.args.ghost
        ? 'var(--j2-color-primary)'
        : '#fff'

      return (
        <div
          className="full-width full-height flex justify-center items-center p-10"
          style={{ backgroundColor }}
        >
          <Story />
        </div>
      )
    },
  ],
  tags: ['autodocs'],
  args: {
    children: 'Optimize Network',
    disabled: false,
    ghost: false,
    danger: false,
    type: 'default',
    shape: 'default',
    icon: 'With Icon',
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
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'],
    },
    icon: {
      control: 'radio',
      options: ['With Icon', 'No Icon'],
      mapping: {
        'With Icon': <ChefHatIcon />,
        'No Icon': undefined,
      },
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

export const Danger: Story = {
  args: {
    danger: true,
    children: 'Danger Zone!',
  },
}
