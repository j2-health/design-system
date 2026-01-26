import type { Meta, StoryObj } from '@storybook/react-vite'

import { Rate } from './Rate'

const meta = {
  title: 'Components/Rate',
  component: Rate,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    count: {
      control: 'number',
    },
    value: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Rate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 4.5,
    count: 5,
  },
}
