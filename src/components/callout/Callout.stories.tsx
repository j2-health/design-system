import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../button'
import { Tag } from '../tag'
import { Callout } from './Callout'

const meta = {
  title: 'Components/Callout',
  component: Callout,
  parameters: {
    layout: 'padded',
  },
  args: {
    children: 'Want to group some of these items?',
  },
} satisfies Meta<typeof Callout>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

// An invitation with one action.
export const Default: Story = {
  args: {
    extra: <Button size="small">Add groups</Button>,
  },
}

// A summary with a count and a footer.
export const Summary: Story = {
  args: {
    title: 'Groups',
    children: 'Each group needs its own column.',
    extra: (
      <span className="text-xs tabular-nums text-j2-text-secondary">2/20</span>
    ),
    footer: (
      <span className="flex gap-1.5">
        <Tag status="default">Group one</Tag>
        <Tag status="default">Group two</Tag>
      </span>
    ),
  },
}
