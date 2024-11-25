import type { Meta, StoryObj } from '@storybook/react'
import { Anchor, ChefHat } from '@phosphor-icons/react'

import { Breadcrumb } from './Breadcrumb'

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { title: 'Home', href: '#', icon: Anchor },
      { title: 'Compare', href: '#' },
      { title: 'Do something', href: '#', icon: ChefHat },
    ],
  },
}
