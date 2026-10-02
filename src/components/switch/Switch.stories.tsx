import { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './Switch'
import { CheckIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    small: false,
    loading: false,
    disabled: false,
  },
  argTypes: {
    small: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    small: false,
    loading: false,
    disabled: false,
  },
}

export const Small: Story = {
  args: {
    small: true,
    loading: false,
    disabled: false,
  },
}

export const Loading: Story = {
  args: {
    small: false,
    loading: true,
    disabled: false,
  },
}

export const Disabled: Story = {
  args: {
    small: false,
    loading: false,
    disabled: true,
  },
}

export const Icon: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)

    return (
      <Switch
        {...args}
        checked={checked}
        onChange={(checked) => setChecked(checked)}
        checkedChildren={<CheckIcon size={14} weight="bold" />}
        unCheckedChildren={<XIcon size={14} weight="bold" />}
      />
    )
  },
}

export const Number: Story = {
  render: (args) => {
    return <Switch {...args} checkedChildren="1" unCheckedChildren="2" />
  },
}

// Text in the track: the switch widens to fit the word. Useful for naming
// the exceptional state only (here "Off").
export const Labelled: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch small defaultChecked unCheckedChildren="Off" />
      <Switch small unCheckedChildren="Off" />
      <Switch checkedChildren="On" unCheckedChildren="Off" defaultChecked />
    </div>
  ),
}
