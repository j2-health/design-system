import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectAll } from './SelectAll'
import type { ManageColumnsColumn } from './ManageColumnsPanel'

const columns: ManageColumnsColumn[] = [
  { id: 'name', label: 'Name', visible: true, pinned: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'region', label: 'Region', visible: true },
  { id: 'address', label: 'Address', visible: false },
  { id: 'phone', label: 'Phone', visible: false },
]

const meta = {
  title: 'Components/SelectAll',
  component: SelectAll,
  parameters: {
    layout: 'centered',
  },
  args: {
    columns,
  },
  argTypes: {
    // An array isn't a meaningful Control on its own — set per-story instead.
    columns: { table: { disable: true } },
    onToggle: { action: 'toggled' },
  },
} satisfies Meta<typeof SelectAll>

export default meta
type Story = StoryObj<typeof meta>

function renderInteractive(args: Story['args']) {
  const [cols, setCols] = useState(args!.columns!)
  return (
    <SelectAll
      {...args}
      columns={cols}
      onToggle={(id) => {
        args!.onToggle?.(id)
        setCols((prev) =>
          prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
        )
      }}
    />
  )
}

export const Default: Story = {
  render: renderInteractive,
}
