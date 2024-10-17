import type { Meta, StoryObj } from '@storybook/react'

import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Network Performance Overview',
    children:
      'Optimizing your provider network might not be thrilling, but hey, it saves money and boosts care quality. Worth it, right?',
  },
}

export const WithTabs: Story = {
  args: {
    title: 'Network Performance Overview',
    children:
      'Optimizing your provider network might not be thrilling, but hey, it saves money and boosts care quality. Worth it, right?',
    tabList: [
      {
        key: 'optimization_tips',
        tab: 'Optimization Tips',
      },
      {
        key: 'performance_comparison',
        tab: 'Performance Comparison',
      },
    ],
  },
}
