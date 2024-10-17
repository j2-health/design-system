import type { Meta, StoryObj } from '@storybook/react'

import { RadioGroup } from './Radio'

const meta = {
  title: 'Components/Radio Group',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    optionType: {
      control: 'radio',
      options: ['default', 'button'],
    },
    buttonStyle: {
      control: 'radio',
      options: ['solid', 'outline'],
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: [
      {
        value: 'medical_group',
        label: 'Medical Group',
      },
      {
        value: 'health_system',
        label: 'Health System',
      },
    ],
  },
}

export const Button: Story = {
  args: {
    optionType: 'button',
    buttonStyle: 'solid',
    options: [
      {
        value: 'medical_group',
        label: 'Medical Group',
      },
      {
        value: 'health_system',
        label: 'Health System',
      },
    ],
  },
}
