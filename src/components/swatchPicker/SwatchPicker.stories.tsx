import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CaretDownIcon } from '@phosphor-icons/react'

import { Swatch } from '../swatch'
import { SwatchPicker, type SwatchPickerColor } from './SwatchPicker'

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

const CATEGORICAL: SwatchPickerColor[] = range(8).map((k) => ({
  value: `categorical-${k}`,
  color: `var(--j2-color-categorical-${k})`,
  label: `Color ${k}`,
}))

// Each of the eight, 45% of the way to white.
const LIGHTER: SwatchPickerColor[] = range(8).map((k) => ({
  value: `categorical-${k}-light`,
  color: `color-mix(in srgb, var(--j2-color-categorical-${k}) 55%, white)`,
  label: `Color ${k}, lighter`,
}))

const colorOf = (value: string) =>
  [...CATEGORICAL, ...LIGHTER].find((c) => c.value === value)?.color

// A control shaped like a small select: the current color and a caret.
const Trigger = ({ value }: { value: string }) => (
  <button
    type="button"
    aria-label="Color"
    className="flex h-6 cursor-pointer items-center gap-1.5 rounded-j2-sm border border-solid border-j2-border bg-white px-2 transition-colors hover:border-j2-gray-8"
  >
    <Swatch color={colorOf(value)} size={12} />
    <CaretDownIcon
      size={10}
      weight="bold"
      className="block text-j2-text-secondary"
    />
  </button>
)

const meta = {
  title: 'Components/SwatchPicker',
  component: SwatchPicker,
  parameters: { layout: 'centered' },
  args: {
    colors: CATEGORICAL,
    value: 'categorical-3',
    label: 'Group A',
    onChange: () => {},
  },
} satisfies Meta<typeof SwatchPicker>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

const Popover = ({
  colors,
  initial,
  defaultValue,
}: {
  colors: SwatchPickerColor[]
  initial: string
  defaultValue?: string
}) => {
  const [value, setValue] = useState(initial)
  return (
    <SwatchPicker
      colors={colors}
      value={value}
      defaultValue={defaultValue}
      label="Group A"
      onChange={setValue}
    >
      <Trigger value={value} />
    </SwatchPicker>
  )
}

/**
 * The eight categorical colors. Offer these alone for a tinted `Tag`, which
 * makes its own pale fill.
 */
export const Default: Story = {
  render: () => <Popover colors={CATEGORICAL} initial="categorical-3" />,
}

/**
 * For colors shown as they are, such as points on a map, a lighter version of
 * each can follow the eight. With a `defaultValue`, "Reset to default" shows
 * once the color differs from it.
 */
export const LighterColors: Story = {
  name: 'Lighter colors',
  render: () => (
    <Popover
      colors={[...CATEGORICAL, ...LIGHTER]}
      initial="categorical-6-light"
      defaultValue="categorical-1"
    />
  ),
}

const Inline = () => {
  const [value, setValue] = useState('categorical-3')
  return (
    <SwatchPicker
      variant="inline"
      colors={CATEGORICAL}
      value={value}
      label="Group A"
      onChange={setValue}
    />
  )
}

/**
 * `variant="inline"` shows the grid in place, with no control or popover, e.g.
 * just after an item is created. A pick doesn't hide it.
 */
export const InlineVariant: Story = {
  name: 'Inline',
  render: () => <Inline />,
}
