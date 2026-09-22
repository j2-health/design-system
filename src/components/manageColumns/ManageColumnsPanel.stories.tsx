import { useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { XIcon } from '@phosphor-icons/react'
import { Button } from '../button'
import {
  ManageColumnsPanel,
  type ManageColumnsColumn,
} from './ManageColumnsPanel'

const longColumns: ManageColumnsColumn[] = [
  { id: 'name', label: 'Name', visible: true, pinned: true },
  ...Array.from({ length: 22 }, (_, i) => ({
    id: `column-${i + 1}`,
    label: `Column ${i + 1}`,
    visible: i % 3 !== 0,
  })),
]

// Generic reproduction of the real side-panel chrome (fixed width, header
// bar, scrollable body) — not a design system component, just enough
// structure to show scroll behavior in a realistic container.
function PanelShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div
      style={{ width: 360, height: 480 }}
      className="flex flex-col border border-j2-border rounded overflow-hidden contain-[layout_paint]"
    >
      <div className="flex items-center justify-between gap-3 h-[50px] px-4 py-3 border-b border-j2-border shrink-0">
        <h2 className="text-base font-semibold text-j2-text m-0">{title}</h2>
        <Button className="p-0" type="link" aria-label="Close">
          <XIcon size={22} weight="regular" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
    </div>
  )
}

const meta = {
  title: 'Components/ManageColumnsPanel',
  component: ManageColumnsPanel,
  parameters: {
    layout: 'centered',
  },
  args: {
    columns: longColumns,
    description:
      'You can hide, show, or reorder columns. Layout is saved for next time, and is only visible to you.',
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

function renderDefault(args: Story['args']) {
  const [columns, setColumns] = useState(args!.columns!)
  return (
    <PanelShell title="Manage Columns">
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
    </PanelShell>
  )
}

export const Default: Story = {
  render: renderDefault,
}

export const AllVisible: Story = {
  name: 'All columns visible',
  args: {
    columns: longColumns.map((c) => ({ ...c, visible: true })),
  },
  render: renderDefault,
}
