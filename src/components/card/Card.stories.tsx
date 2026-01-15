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
    size: {
      control: 'inline-radio',
      options: ['default', 'small', 'large'],
    },
    innerVariant: {
      control: 'inline-radio',
      options: ['default', 'basic'],
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
    size: 'default',
    innerVariant: 'default',
  },
}

export const WithTabs: Story = {
  args: {
    ...Default.args,
    size: 'default',
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
    size: 'default',
  },
}

export const Inner: Story = {
  args: {
    ...Default.args,
    type: 'inner',
    title: 'Innie',
    children: <p>I'm an innie</p>,
    size: 'default',
  },
  render: (args) => {
    return (
      <Card title="Outie">
        <div className="flex flex-col gap-3">
          <Card {...args} title="Inner Default" />
          <Card {...args} title="Inner Basic" innerVariant="basic">
            <p>I'm an inner card with basic variant</p>
          </Card>
          <Card
            {...args}
            size="small"
            title="Small Inner Basic"
            innerVariant="basic"
          >
            <p>I'm an small inner card with basic variant</p>
          </Card>
        </div>
      </Card>
    )
  },
}

export const Small: Story = {
  args: {
    ...Default.args,
    size: 'small',
  },
}

export const SmallWithTabs: Story = {
  args: {
    ...Default.args,
    size: 'small',
    tabList: [
      {
        key: 'optimization_tips',
        tab: 'Optimization Tips',
      },
    ],
  },
}

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'large',
  },
}

export const LargeWithTabs: Story = {
  args: {
    ...Default.args,
    size: 'large',
    tabList: [
      {
        key: 'optimization_tips',
        tab: 'Optimization Tips',
      },
    ],
  },
}
