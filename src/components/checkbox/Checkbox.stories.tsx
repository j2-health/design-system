import { StoryObj, Meta } from '@storybook/react'

import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: 'text' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Checkbox',
  },
}

export const Group: Story = {
  render: () => <Checkbox.Group options={['Apple', 'Pear', 'Orange']} />,
}

export const VerticalGroup: Story = {
  render: () => (
    <Checkbox.Group
      className="flex flex-col"
      options={['Apple', 'Pear', 'Orange']}
    />
  ),
}
