import { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'number',
      defaultValue: 80,
    },
  },
  args: {
    size: 80,
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
