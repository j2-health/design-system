import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs, Props } from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => {
      return (
        <div className="w-[400px]">
          <Story />
        </div>
      )
    },
  ],
} satisfies Meta<Props>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      {
        key: 'first-tab',
        label: 'First tab',
        children: 'First tab content',
      },
      {
        key: 'second-tab',
        label: 'Second tab',
        children: 'Second tab content',
      },
    ],
  },
}

// Flush and justified: the tabs share the width, and the content sits against
// the bar and fills the remaining height (here a 240px panel).
export const FlushJustified: Story = {
  name: 'Flush and justified',
  decorators: [
    (Story) => (
      <div className="flex h-[240px] w-[400px] flex-col rounded-j2 border border-j2-border-secondary">
        <Story />
      </div>
    ),
  ],
  args: {
    flush: true,
    justified: true,
    items: [
      {
        key: 'one',
        label: 'Tab one',
        children: (
          <div className="h-full bg-j2-gray-2 p-3 text-sm">
            Content fills the panel
          </div>
        ),
      },
      {
        key: 'two',
        label: 'Tab two',
        children: <div className="h-full p-3 text-sm">Second tab</div>,
      },
      {
        key: 'three',
        label: 'Tab three',
        children: <div className="h-full p-3 text-sm">Third tab</div>,
      },
    ],
  },
}
