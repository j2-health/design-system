import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioGroup } from './Radio'

const meta = {
  title: 'Components/Radio Group',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  args: {
    disabled: false,
    value: 'medical_group',
    optionType: 'default',
    size: 'middle',
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
  argTypes: {
    optionType: {
      control: 'radio',
      options: ['default', 'button'],
    },
    buttonStyle: {
      control: 'radio',
      options: ['solid', 'outline'],
    },
    disabled: {
      control: 'boolean',
    },
    size: {
      control: 'radio',
      options: ['small', 'middle', 'large'],
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    optionType: 'default',
  },
}

export const SolidButton: Story = {
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

export const OutlineButton: Story = {
  args: {
    buttonStyle: 'outline',
    optionType: 'button',
  },
}
