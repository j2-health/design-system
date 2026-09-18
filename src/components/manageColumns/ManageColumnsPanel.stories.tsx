import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ManageColumnsPanel,
  type ManageColumnsColumn,
} from './ManageColumnsPanel'

const defaultColumns: ManageColumnsColumn[] = [
  { id: 'name', label: 'Name', visible: true, pinned: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'status', label: 'Status', visible: true },
  { id: 'region', label: 'Region', visible: true },
  { id: 'address', label: 'Address', visible: false },
  { id: 'phone', label: 'Phone', visible: false },
]

const meta = {
  title: 'Components/ManageColumnsPanel',
  component: ManageColumnsPanel,
  parameters: {
    layout: 'centered',
  },
  args: {
    columns: defaultColumns,
  },
  argTypes: {
    // An array isn't a meaningful Control on its own — set per-story instead.
    columns: { table: { disable: true } },
    onToggle: { action: 'toggled' },
    onReorder: { action: 'reordered' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof ManageColumnsPanel>

export default meta
type Story = StoryObj<typeof meta>

// Wires the panel to local state so checkboxes are genuinely clickable in
// the canvas, the same as they'd be in the app.
function renderInteractive(args: Story['args']) {
  const [columns, setColumns] = useState(args!.columns!)
  return (
    <div style={{ width: 280 }}>
      <ManageColumnsPanel
        {...args}
        columns={columns}
        onToggle={(id) => {
          args!.onToggle?.(id)
          setColumns((prev) =>
            prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
          )
        }}
        onReorder={(orderedIds) => {
          args!.onReorder?.(orderedIds)
          setColumns((prev) => {
            const byId = new Map(prev.map((c) => [c.id, c]))
            return orderedIds
              .map((id) => byId.get(id))
              .filter((c): c is ManageColumnsColumn => Boolean(c))
          })
        }}
      />
    </div>
  )
}

export const Default: Story = {
  render: renderInteractive,
}

export const AllVisible: Story = {
  name: 'All columns visible',
  args: {
    columns: defaultColumns.map((c) => ({ ...c, visible: true })),
  },
  render: renderInteractive,
}
