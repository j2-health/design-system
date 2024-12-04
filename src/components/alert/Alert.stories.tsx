import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  args: {
    closable: false,
    showIcon: true,
    banner: true,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'info', 'warning', 'error'],
    },
    message: { control: 'text' },
    description: { control: 'text' },
    banner: { control: 'boolean' },
    closable: { control: 'boolean' },
    showIcon: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: {
    type: 'success',
    message: 'Network Optimized – High Five!',
    description:
      'Your provider network is now optimized. Time to sit back and relax!',
    banner: false,
  },
}

export const Info: Story = {
  args: {
    type: 'info',
    message: 'Heads Up!',
    description: 'Just a friendly reminder to review your network performance.',
    banner: false,
  },
}

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'Warning – Check Your Network',
    description:
      'Something might be off with your network. Better take a look.',
    banner: false,
  },
}

export const Error: Story = {
  args: {
    type: 'error',
    message: 'Oops, Something Went Wrong',
    description:
      'Looks like there’s an issue. Let’s fix it and get back on track.',
    banner: false,
  },
}

export const MessageOnly: Story = {
  args: {
    ...Success.args,
    description: undefined,
  },
}
