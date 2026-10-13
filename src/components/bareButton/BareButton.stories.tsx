import type { Meta, StoryObj } from '@storybook/react-vite'

import { Swatch } from '../swatch'
import { BareButton } from './BareButton'

const meta = {
  title: 'Components/BareButton',
  component: BareButton,
  parameters: { layout: 'centered' },
  args: {
    'aria-label': 'Select',
    children: <Swatch color="var(--j2-color-primary)" />,
  },
} satisfies Meta<typeof BareButton>

// eslint-disable-next-line no-restricted-exports
export default meta
type Story = StoryObj<typeof meta>

/** A swatch made clickable. Tab to it to see the focus ring. */
export const Default: Story = {}

/**
 * The ring reads CSS variables, so a class or `style` on the button or any
 * ancestor changes it. Here it sits 2px off the swatch, in a darker color.
 */
export const CustomRing: Story = {
  name: 'Custom ring',
  args: {
    className:
      '[--j2-focus-ring-offset:2px] [--j2-focus-ring-color:var(--j2-color-text-heading)]',
  },
}
