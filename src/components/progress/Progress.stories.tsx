import { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './Progress'

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    percent: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    type: {
      control: 'select',
      options: ['line', 'circle', 'dashboard'],
    },
    size: {
      control: { type: 'number' },
    },
    strokeWidth: {
      control: { type: 'number' },
    },
    showInfo: {
      control: 'boolean',
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

// Line Type Stories
export const LineDefault: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Progress type="line" percent={70} />
    </div>
  ),
}

export const LineWithStatus: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Progress type="line" percent={100} status="success" />
    </div>
  ),
}

// Circle Type Stories
export const CircleDefault: Story = {
  args: {
    type: 'circle',
    percent: 75,
  },
}

export const CircleComplete: Story = {
  args: {
    type: 'circle',
    percent: 100,
    strokeColor: 'var(--j2-color-success)',
  },
}

// Circle IconSize Variant
export const CircleIconSize: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Progress
        type="circle"
        percent={60}
        size={24}
        showInfo={false}
        strokeWidth={12.5}
        strokeColor="var(--j2-color-error)"
      />
      <Progress
        type="circle"
        percent={100}
        size={24}
        showInfo={false}
        strokeWidth={12.5}
        strokeColor="var(--j2-color-success)"
      />
    </div>
  ),
}

// Dashboard Type Stories
export const DashboardDefault: Story = {
  args: {
    type: 'dashboard',
    percent: 75,
  },
}

export const DashboardWithCustomColor: Story = {
  args: {
    type: 'dashboard',
    percent: 85,
    strokeColor: {
      '0%': '#108ee9',
      '100%': '#87d068',
    },
  },
}
