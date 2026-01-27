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
