import type { Meta, StoryObj } from '@storybook/react-vite'

import { ThresholdBar } from './ThresholdBar'

const meta = {
  title: 'Components/ThresholdBar',
  component: ThresholdBar,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ThresholdBar>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

// A rise: the solid segment is where things stand, the stripes are where
// they could go, and the marker labels the projected value.
export const Rising: Story = {
  args: {
    value: 62,
    projected: 81,
    marker: { value: 81, label: 'If applied', detail: '81%' },
    threshold: { value: 75, label: 'Threshold 75%' },
    ariaLabel: 'Rises from 62% to 81% if applied; threshold 75%',
  },
}

// A fall below the threshold: the projected value becomes the solid segment
// and the stripes show what would be lost.
export const Falling: Story = {
  args: {
    value: 58,
    projected: 79,
    color: 'var(--j2-color-interval-7-7)',
    stripeColors: {
      fill: 'var(--j2-color-interval-7-2)',
      stripe: 'var(--j2-color-interval-7-3)',
    },
    marker: { value: 58, label: 'If removed', detail: '58%' },
    threshold: { value: 75, label: 'Threshold 75%' },
    ariaLabel: 'Falls from 79% to 58% if removed; threshold 75%',
  },
}

export const ValueOnly: Story = {
  name: 'Value only',
  args: { value: 40, ariaLabel: '40%' },
}
