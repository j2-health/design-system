import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { BareButton } from '../bareButton'
import { Popover } from '../popover'
import {
  SwatchStrip,
  type SwatchStripGroup,
  type SwatchStripItem,
} from './SwatchStrip'

type LabelledItem = Extract<SwatchStripItem, { label: string }>

const items = (
  count: number,
  prefix: string,
  swatch: SwatchStripItem['swatch']
): LabelledItem[] =>
  Array.from({ length: count }, (_, i) => ({
    key: `${prefix}-${i}`,
    label: `${prefix} ${i + 1}`,
    swatch,
  }))

const groups: (SwatchStripGroup & { items: LabelledItem[] })[] = [
  {
    key: 'a',
    items: items(7, 'Area A', { color: 'var(--j2-color-interval-7-7)' }),
  },
  { key: 'b', items: items(2, 'Area B', { color: 'var(--j2-color-primary)' }) },
  { key: 'c', items: items(8, 'Area C', { variant: 'outline' }) },
]

const labelOf = (key: string | null) =>
  groups.flatMap((group) => group.items).find((item) => item.key === key)
    ?.label ?? groups[0].items[0].label

const Details = ({ label }: { label: string }) => (
  <div className="w-48 text-sm">Details for {label}.</div>
)

const OpeningDetailsDemo = () => {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      paddingSize="sm"
      content={<Details label={labelOf(selected)} />}
      // Reset once closed, so the closing popover doesn't flip its content.
      afterOpenChange={(open) => !open && setSelected(null)}
    >
      <div className="cursor-pointer rounded-j2-sm p-3 hover:bg-j2-gray-2">
        <SwatchStrip
          groups={groups}
          renderItem={(props, { item }) => (
            <BareButton {...props} onClick={() => setSelected(item.key)} />
          )}
          renderOverflow={(props, { group, count }) => (
            <BareButton
              {...props}
              aria-label={`${count} more in ${group.key.toUpperCase()}`}
              onClick={() => setSelected(group.items[0].key)}
            />
          )}
        />
      </div>
    </Popover>
  )
}

const ExpandingGroupsDemo = () => {
  const [selected, setSelected] = useState(groups[0].items[0].key)
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string[]>([])
  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      paddingSize="sm"
      open={open}
      onOpenChange={setOpen}
      content={<Details label={labelOf(selected)} />}
    >
      <div className="cursor-pointer rounded-j2-sm p-3 hover:bg-j2-gray-2">
        <SwatchStrip
          groups={groups.map((group) =>
            expanded.includes(group.key) ? { ...group, max: Infinity } : group
          )}
          renderItem={(props, { item }) => (
            <BareButton
              {...props}
              aria-pressed={open && item.key === selected}
              onClick={(event) => {
                event.stopPropagation()
                setSelected(item.key)
                setOpen(true)
              }}
            />
          )}
          renderOverflow={(props, { group, count }) => (
            <BareButton
              {...props}
              aria-label={`Show ${count} more`}
              onClick={(event) => {
                event.stopPropagation()
                setExpanded((prev) => [...prev, group.key])
              }}
            />
          )}
        />
      </div>
    </Popover>
  )
}

const meta = {
  title: 'Components/SwatchStrip',
  component: SwatchStrip,
  parameters: { layout: 'centered' },
  args: {
    max: 5,
    size: 12,
    groups: [
      {
        key: 'strong-down',
        items: items(7, 'Area', { color: 'var(--j2-color-interval-7-7)' }),
      },
      {
        key: 'strong-up',
        items: items(2, 'Area', { color: 'var(--j2-color-primary)' }),
      },
      {
        key: 'soft-down',
        items: items(3, 'Area', {
          variant: 'hatched',
          color: 'var(--j2-color-interval-7-7)',
          tint: 'var(--j2-color-interval-7-1)',
          stroke: 'var(--j2-color-interval-7-4)',
        }),
      },
      { key: 'none', items: items(1, 'Area', { variant: 'outline' }) },
    ],
  },
} satisfies Meta<typeof SwatchStrip>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * `renderItem` and `renderOverflow` swap the squares and the `+N` for
 * buttons. Clicks bubble, so here they select an item and then open the
 * wrapping popover. `+N` opens it at its group's first item. Like any click
 * trigger, a second click closes it; see the next story to keep it open.
 */
export const OpeningDetails: Story = {
  name: 'Opening details',
  render: () => <OpeningDetailsDemo />,
}

/**
 * The handlers stop propagation and drive a controlled popover instead. A
 * square opens it and is pressed while it shows; `+N` expands its group in
 * place by raising that group's `max`.
 */
export const ExpandingGroups: Story = {
  name: 'Expanding a group',
  render: () => <ExpandingGroupsDemo />,
}

/**
 * On a narrow container the strip wraps between groups. A wrapped group
 * starts flush with the line above, with no divider before it. `groupGap`
 * and `rowGap` set the spacing.
 */
export const Wrapping: Story = {
  args: { groups },
  decorators: [
    (Story) => (
      <div
        className="border border-dashed border-j2-border"
        style={{ width: 150 }}
      >
        <Story />
      </div>
    ),
  ],
}

/**
 * `label` names an item for assistive tech; `tooltip` replaces what shows on
 * hover. A string `tooltip` alone does both, and `tooltip: false` shows none.
 */
export const TooltipAndLabel: Story = {
  name: 'Tooltip and label',
  args: {
    groups: [
      {
        key: 'a',
        items: [
          {
            key: 'a1',
            label: 'Area A 1, 3 items',
            tooltip: (
              <>
                <div className="font-medium">Area A 1</div>
                <div>3 items</div>
              </>
            ),
            swatch: { color: 'var(--j2-color-interval-7-7)' },
          },
          {
            key: 'a2',
            tooltip: 'Area A 2',
            swatch: { color: 'var(--j2-color-interval-7-7)' },
          },
          {
            key: 'a3',
            label: 'Area A 3',
            tooltip: false,
            swatch: { color: 'var(--j2-color-interval-7-7)' },
          },
        ],
      },
    ],
  },
}

/**
 * A group's `overflow` sets the `+N` count, e.g. for a strip that shows a
 * subset and reports how many items it leaves out. Children passed to the
 * overflow element replace its text.
 */
export const ReportedOverflow: Story = {
  name: 'Reported overflow',
  args: {
    groups: [{ ...groups[1], overflow: 7 }],
    renderOverflow: (props, { count }) => (
      <span {...props}>
        +{count} other{count === 1 ? '' : 's'}
      </span>
    ),
  },
}
