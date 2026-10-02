import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../button'
import { Switch } from '../switch'
import { StatusPill } from './StatusPill'

const meta = {
  title: 'Components/StatusPill',
  component: StatusPill,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StatusPill>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

// Something waiting to be confirmed: a tinted pill whose label opens a
// review, with the confirming action at the end.
export const WithAction: Story = {
  name: 'Needs attention, with an action',
  args: {
    label: 'Unsaved changes',
    detail: '3',
    tone: 'warning',
    onClick: () => {},
    trailing: (
      <Button size="xs" type="primary">
        Save
      </Button>
    ),
  },
}

const WithSwitchExample = () => {
  const [on, setOn] = useState(true)
  return (
    <StatusPill
      label="Preview"
      detail="+2 −1"
      menu={{
        items: [
          { key: 'open', label: 'Open changes' },
          { key: 'reset', label: 'Reset', danger: true },
        ],
      }}
      labelAriaLabel="Preview actions"
      trailing={<Switch small checked={on} onChange={setOn} />}
    />
  )
}

// A mode the user can toggle: the label opens a menu, the switch flips it.
export const WithSwitch: Story = {
  name: 'With a menu and a switch',
  args: { label: 'Preview' },
  render: () => <WithSwitchExample />,
}

export const Disabled: Story = {
  args: {
    label: 'Nothing to preview',
    disabled: true,
    trailing: <Switch small checked={false} disabled />,
  },
}

export const InARow: Story = {
  name: 'Beside buttons',
  args: { label: 'Unsaved changes' },
  render: () => (
    <div className="flex items-center gap-2">
      <StatusPill
        label="Unsaved changes"
        detail="3"
        tone="warning"
        onClick={() => {}}
        trailing={
          <Button size="xs" type="primary">
            Save
          </Button>
        }
      />
      <StatusPill label="Preview" trailing={<Switch small defaultChecked />} />
      <Button size="small" type="primary">
        Share
      </Button>
    </div>
  ),
}
