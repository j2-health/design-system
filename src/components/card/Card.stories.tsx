import type { Meta, StoryObj } from '@storybook/react'

import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    bordered: {
      control: {
        type: 'boolean',
      },
    },
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
    ...Default.args,
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

export const Borderless: Story = {
  args: {
    ...Default.args,
    bordered: false,
  },
}

export const Inner: Story = {
  args: {
    ...Default.args,
    type: 'inner',
    title: 'Innie',
    children: <p>I'm an innie</p>,
  },
  render: (args) => {
    return (
      <Card title="Outie">
        <Card {...args} />
      </Card>
    )
  },
}
