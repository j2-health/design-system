import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FunnelSimpleXIcon,
  ListMagnifyingGlassIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'

import { Button } from '../button'
// Example artwork for the story only; the component bundles no illustration.
import EmptyIllustration from './empty-illustration.example.svg'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['default', 'compact'],
    },
  },
  args: {
    title: 'No changes yet',
    description: 'Changes you make to this list will show up here.',
    size: 'default',
  },
} satisfies Meta<typeof EmptyState>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <ListMagnifyingGlassIcon size={64} />,
  },
}

// The page-level pattern: an illustration, a heading-sized title and a line of
// guidance, as on a list page with nothing in it yet. Pass any illustration as
// `icon`; it is decorative and hidden from assistive tech.
export const WithIllustration: Story = {
  name: 'With an illustration',
  args: {
    title: 'No items yet',
    description: 'Items you create will be listed here.',
    icon: <EmptyIllustration width={120} height={120} />,
    action: (
      <Button type="primary" size="small">
        Create item
      </Button>
    ),
  },
}

// No title: the description carries the whole message, so no heading renders.
export const MessageOnly: Story = {
  name: 'Message only',
  args: {
    title: undefined,
    description:
      'This view is not available for the current selection. Please choose another.',
    icon: <EmptyIllustration width={120} height={120} />,
  },
}

export const WithAction: Story = {
  name: 'With an action',
  args: {
    title: 'No results',
    description: undefined,
    icon: <FunnelSimpleXIcon size={64} />,
    action: (
      <Button type="text" size="small">
        Clear filters
      </Button>
    ),
  },
}

export const Compact: Story = {
  args: {
    size: 'compact',
    title: 'Nothing to list',
    description: 'These records can’t be displayed individually.',
    icon: <UsersThreeIcon size={40} />,
  },
  render: (args) => (
    <div className="w-80 rounded-j2 border border-j2-border-secondary bg-white">
      <EmptyState {...args} />
    </div>
  ),
}
