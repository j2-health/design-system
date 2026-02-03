import { Meta, StoryObj } from '@storybook/react-vite'
import { CircularProgress } from './CircularProgress'

const meta: Meta<typeof CircularProgress> = {
  title: 'Components/CircularProgress',
  component: CircularProgress,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    percent: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    size: {
      control: { type: 'number', min: 16, max: 200 },
    },
    strokeWidth: {
      control: { type: 'number', min: 1, max: 316 },
    },
    showPercent: {
      control: 'boolean',
    },
    ringClassName: {
      control: 'text',
      description: 'Use text-* classes for ring color',
    },
    trackClassName: {
      control: 'text',
      description: 'Use text-* classes for track color',
    },
    centerClassName: {
      control: 'text',
      description: 'Use text-* classes for center fill',
    },
    textClassName: {
      control: 'text',
      description: 'Classes for percentage text',
    },
  },
  args: {
    percent: 75,
    size: 64,
    strokeWidth: 6,
    showPercent: false,
    ringClassName: 'text-j2-gray-4',
    trackClassName: 'text-j2-primary',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomColors: Story = {
  args: {
    percent: 60,
    ringClassName: 'text-j2-gold-3',
    trackClassName: 'text-j2-gold-6',
    showPercent: true,
  },
}

export const SmallSize: Story = {
  args: {
    size: 24,
    strokeWidth: 3,
    percent: 52,
    ringClassName: 'text-[#f0f0f0]',
    trackClassName: 'text-[#99000d]',
  },
}

export const LargeSize: Story = {
  args: {
    size: 160,
    strokeWidth: 12,
    percent: 85,
    showPercent: true,
  },
}

export const ThinRing: Story = {
  args: {
    strokeWidth: 4,
    percent: 65,
    size: 80,
  },
}

export const ThickRing: Story = {
  args: {
    strokeWidth: 16,
    percent: 45,
    size: 80,
  },
}

export const WithCenterFill: Story = {
  args: {
    percent: 72,
    size: 80,
    showPercent: true,
    centerClassName: 'text-j2-blue-8',
    ringClassName: 'text-white',
    textClassName: 'text-j2-blue-3',
  },
}

export const FullPercent: Story = {
  args: {
    percent: 100,
    showPercent: true,
    trackClassName: 'text-j2-green-6',
  },
}

export const SuccessVariant: Story = {
  args: {
    percent: 100,
    ringClassName: 'text-j2-green-2',
    trackClassName: 'text-j2-green-6',
    showPercent: true,
    textClassName: 'text-j2-green-7',
  },
}

export const ErrorVariant: Story = {
  args: {
    percent: 25,
    ringClassName: 'text-j2-red-2',
    trackClassName: 'text-j2-red-5',
    showPercent: true,
    textClassName: 'text-j2-red-6',
  },
}

export const MultipleProgresses: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <CircularProgress
        percent={25}
        size={32}
        strokeWidth={6}
        ringClassName="text-j2-gray-3"
        trackClassName="text-j2-red-5"
      />
      <CircularProgress
        percent={50}
        size={48}
        strokeWidth={8}
        ringClassName="text-j2-gray-3"
        trackClassName="text-j2-gold-6"
      />
      <CircularProgress
        percent={75}
        size={64}
        strokeWidth={9}
        ringClassName="text-j2-gray-3"
        trackClassName="text-j2-primary"
        showPercent
      />
      <CircularProgress
        percent={100}
        size={80}
        strokeWidth={10}
        ringClassName="text-j2-gray-3"
        trackClassName="text-j2-green-6"
        showPercent
      />
    </div>
  ),
}
