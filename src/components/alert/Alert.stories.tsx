import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
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
    message: 'Success Alert',
    description: 'This is a success alert with a description.',
    banner: false,
    closable: true,
    showIcon: true,
  },
}

export const Info: Story = {
  args: {
    type: 'info',
    message: 'Info Alert',
    description: 'This is an info alert with a description.',
    banner: false,
    closable: true,
    showIcon: true,
  },
}

export const Warning: Story = {
  args: {
    type: 'warning',
    message: 'Warning Alert',
    description: 'This is a warning alert with a description.',
    banner: false,
    closable: true,
    showIcon: true,
  },
}

export const Error: Story = {
  args: {
    type: 'error',
    message: 'Error Alert',
    description: 'This is an error alert with a description.',
    banner: false,
    closable: true,
    showIcon: true,
  },
}
