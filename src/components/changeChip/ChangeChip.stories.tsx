import type { Meta, StoryObj } from '@storybook/react-vite'

import { Popover } from '../popover'
import { ChangeChip } from './ChangeChip'

const meta = {
  title: 'Components/ChangeChip',
  component: ChangeChip,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ChangeChip>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

export const Variations: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <ChangeChip
        swatch={{ color: 'var(--j2-color-primary)' }}
        delta={{ direction: 'up', value: '4.2 pts' }}
        srLabel="Area A: up 4.2 points"
      />
      <ChangeChip
        swatch={{ color: 'var(--j2-color-interval-7-7)' }}
        label="Area B"
        delta={{
          direction: 'down',
          value: '1.8 pts',
          color: 'var(--j2-color-interval-7-7)',
        }}
      />
      <ChangeChip
        swatch={{ variant: 'outline' }}
        label="Area C"
        placeholder="—"
      />
    </div>
  ),
}

export const WithPopover: Story = {
  name: 'Opening details',
  render: () => (
    <Popover
      trigger="click"
      placement="bottomLeft"
      paddingSize="sm"
      content={<div className="w-48 text-sm">Details about this change.</div>}
    >
      <ChangeChip
        swatch={{ color: 'var(--j2-color-primary)' }}
        label="Area A"
        delta={{ direction: 'up', value: '4.2 pts' }}
      />
    </Popover>
  ),
}
