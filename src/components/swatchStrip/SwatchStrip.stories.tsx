import type { Meta, StoryObj } from '@storybook/react-vite'

import { SwatchStrip, type SwatchStripItem } from './SwatchStrip'

const items = (
  count: number,
  prefix: string,
  swatch: SwatchStripItem['swatch']
): SwatchStripItem[] =>
  Array.from({ length: count }, (_, i) => ({
    key: `${prefix}-${i}`,
    label: `${prefix} ${i + 1}`,
    swatch,
  }))

const meta = {
  title: 'Components/SwatchStrip',
  component: SwatchStrip,
  parameters: { layout: 'centered' },
  args: {
    max: 5,
    size: 12,
    groups: [
      {
        key: 'strong-down',
        items: items(7, 'Area', { color: 'var(--j2-color-interval-7-7)' }),
      },
      {
        key: 'strong-up',
        items: items(2, 'Area', { color: 'var(--j2-color-primary)' }),
      },
      {
        key: 'soft-down',
        items: items(3, 'Area', {
          variant: 'hatched',
          color: 'var(--j2-color-interval-7-7)',
          tint: 'var(--j2-color-interval-7-1)',
          stroke: 'var(--j2-color-interval-7-4)',
        }),
      },
      { key: 'none', items: items(1, 'Area', { variant: 'outline' }) },
    ],
  },
} satisfies Meta<typeof SwatchStrip>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
