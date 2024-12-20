import type { Meta, StoryObj } from '@storybook/react'
import { InputNumber } from './InputNumber'

const meta: Meta<typeof InputNumber> = {
  title: 'Components/InputNumber',
  component: InputNumber,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    step: {
      control: 'number',
      defaultValue: 1,
    },
    onChange: { action: 'changed' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    min: 0,
    max: 100,
    step: 1,
  },
}
