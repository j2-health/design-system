import type { Meta, StoryObj } from '@storybook/react-vite'

import { Swatch } from './Swatch'

const meta = {
  title: 'Components/Swatch',
  component: Swatch,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'radio', options: ['solid', 'hatched', 'outline'] },
    color: { control: 'text' },
  },
  args: { variant: 'solid', color: 'var(--j2-color-primary)', size: 16 },
} satisfies Meta<typeof Swatch>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Solid for the strong form of a meaning, hatched for the softer form, and
// outline for none. Two hues, so a pair of meanings reads as four squares.
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Swatch color="var(--j2-color-interval-7-7)" />
      <Swatch
        variant="hatched"
        color="var(--j2-color-interval-7-7)"
        tint="var(--j2-color-interval-7-1)"
        stroke="var(--j2-color-interval-7-4)"
      />
      <Swatch color="var(--j2-color-primary)" />
      <Swatch variant="hatched" color="var(--j2-color-primary)" />
      <Swatch variant="outline" />
    </div>
  ),
}
