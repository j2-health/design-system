import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { ListRow } from './ListRow'

const meta = {
  title: 'Components/ListRow',
  component: ListRow,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Story: any) => (
      <div className="w-96 overflow-hidden rounded-j2 border border-j2-border-secondary bg-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListRow>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

const Body = ({ title, meta }: { title: string; meta: string }) => (
  <>
    <div className="text-sm font-medium text-j2-text">{title}</div>
    <div className="text-xs text-j2-text-secondary">{meta}</div>
  </>
)

export const States: Story = {
  render: () => (
    <>
      <ListRow onClick={() => {}}>
        <Body title="Resting" meta="Hover to see the hover tint" />
      </ListRow>
      <ListRow highlighted onClick={() => {}}>
        <Body title="Highlighted" meta="Hover driven from elsewhere" />
      </ListRow>
      <ListRow selected onClick={() => {}}>
        <Body title="Selected" meta="Keeps its fill under the cursor" />
      </ListRow>
      <ListRow pending onClick={() => {}}>
        <Body title="Pending" meta="A change not applied yet" />
      </ListRow>
      <ListRow pending selected onClick={() => {}}>
        <Body title="Pending and selected" meta="Pending wins" />
      </ListRow>
    </>
  ),
}

const records = [
  { id: 'a', title: 'Record A', meta: 'Group 1 · 2.4 mi' },
  { id: 'b', title: 'Record B', meta: 'Group 2 · 3.1 mi' },
  { id: 'c', title: 'Record C', meta: 'Group 1 · 5.8 mi' },
  { id: 'd', title: 'Record D', meta: 'Group 3 · 7.0 mi' },
]

const InteractiveList = () => {
  const [selected, setSelected] = useState<string[]>(['b'])
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    )

  return (
    <>
      {records.map((record) => (
        <ListRow
          key={record.id}
          selected={selected.includes(record.id)}
          onClick={() => toggle(record.id)}
        >
          <Body title={record.title} meta={record.meta} />
        </ListRow>
      ))}
    </>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveList />,
}

// Selection controls: a checkbox to pick several rows, a radio to pick one.
// The control and the row are separate targets: the control selects, the rest
// of the row runs `onClick` (e.g. opens the record).
const SelectableList = ({ mode }: { mode: 'checkbox' | 'radio' }) => {
  const [selected, setSelected] = useState<string[]>(['b'])
  const [opened, setOpened] = useState<string | null>(null)

  return (
    <>
      {records.map((record) => (
        <ListRow
          key={record.id}
          selection={mode}
          selectionLabel={record.title}
          selected={selected.includes(record.id)}
          onSelectedChange={(next) =>
            setSelected((current) =>
              mode === 'radio'
                ? [record.id]
                : next
                  ? [...current, record.id]
                  : current.filter((x) => x !== record.id)
            )
          }
          onClick={() => setOpened(record.id)}
        >
          <Body
            title={record.title}
            meta={opened === record.id ? 'Opened' : record.meta}
          />
        </ListRow>
      ))}
    </>
  )
}

export const WithCheckboxes: Story = {
  name: 'With checkboxes',
  render: () => <SelectableList mode="checkbox" />,
}

export const WithRadios: Story = {
  name: 'With radios',
  render: () => <SelectableList mode="radio" />,
}
