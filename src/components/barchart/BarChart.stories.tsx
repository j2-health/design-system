import type { Meta, StoryObj } from '@storybook/react'

import { BarChart } from './BarChart'

const meta = {
  title: 'Components/BarChart',
  component: BarChart,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '450px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarChart>

export default meta
type Story = StoryObj<typeof meta>

export const Nivo: Story = {
  args: {},
}
