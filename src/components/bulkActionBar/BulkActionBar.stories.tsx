import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Controls,
  Description,
  Markdown,
  Primary,
  Stories,
  Title,
} from '@storybook/addon-docs/blocks'
import { ArchiveIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { BulkActionBar } from './BulkActionBar'
import { Button } from '../button'

const changelog = `
## Changelog

### Initial — 2026-06-01

**What:** New floating bulk-action toolbar. Slides in from the bottom of
the viewport whenever \`count > 0\` and renders a single primary action
(Archive / Restore / Delete / etc.) alongside a Cancel button that
clears the selection.

**Why:** Member Files and Networks both gained checkbox row selection
during the Standalone Member File initiative. Both surfaces needed a
floating action bar with the same shape — count, action, cancel — and
the same destructive-intent rule (neutral pill; destructive intent
lives in the confirmation modal that follows). Promoting the component
out of the prototype prevents the next surface that adds bulk selection
from re-rolling the same thing.

**Notes:** The bar is purely neutral by design — \`type="text"\` button
on a navy pill. If you need a destructive-looking bulk action, confirm
intent via a Modal after \`onClick\` rather than styling the bar itself.
The label is always \`"<count> selected"\` — the surrounding view tells
the user what the selection is *of*, so the bar doesn't need to name it.
`

const meta = {
  title: 'Components/BulkActionBar',
  component: BulkActionBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Markdown>{changelog}</Markdown>
        </>
      ),
    },
  },
  argTypes: {
    // `count` is a runtime value (driven by the host's selection state),
    // not a design knob — hide it from the Controls panel.
    count: { table: { disable: true } },
  },
} satisfies Meta<typeof BulkActionBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    count: 2,
    action: {
      label: 'Archive',
      icon: <ArchiveIcon size={14} />,
      onClick: () => {
        /* noop in story */
      },
    },
    onCancel: () => {
      /* noop in story */
    },
  },
}

export const RestoreVariant: Story = {
  name: 'Restore (archived view)',
  args: {
    ...Default.args,
    action: {
      label: 'Restore',
      icon: <ArrowCounterClockwiseIcon size={14} />,
      onClick: () => {
        /* noop in story */
      },
    },
  },
}

export const Hidden: Story = {
  name: 'Hidden (count = 0)',
  args: {
    ...Default.args,
    count: 0,
  },
}

/** Interactive demo wired to a small selection state. */
export const Interactive: Story = {
  args: Default.args,
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<number[]>([])
    return (
      <div style={{ padding: 32, minHeight: 400 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Button onClick={() => setSelected([1])}>Select 1</Button>
          <Button onClick={() => setSelected([1, 2, 3])}>Select 3</Button>
          <Button onClick={() => setSelected([])}>Clear</Button>
        </div>
        <BulkActionBar
          count={selected.length}
          action={{
            label: 'Archive',
            icon: <ArchiveIcon size={14} />,
            onClick: () => setSelected([]),
          }}
          onCancel={() => setSelected([])}
        />
      </div>
    )
  },
}
