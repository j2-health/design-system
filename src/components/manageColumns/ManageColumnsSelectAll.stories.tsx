import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ManageColumnsSelectAll } from './ManageColumnsSelectAll'
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
  title: 'Components/ManageColumnsSelectAll',
  component: ManageColumnsSelectAll,
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
} satisfies Meta<typeof ManageColumnsSelectAll>

export default meta
type Story = StoryObj<typeof meta>

function renderInteractive(args: Story['args']) {
  const [cols, setCols] = useState(args!.columns!)
  return (
    <ManageColumnsSelectAll
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

export const AllVisible: Story = {
  name: 'All columns visible',
  args: {
    columns: columns.map((c) => ({ ...c, visible: true })),
  },
  render: renderInteractive,
}
