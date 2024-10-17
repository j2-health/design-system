import type { Meta, StoryObj } from '@storybook/react'

import { Tooltip } from './Tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: 'radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title:
      'Did you know? CMS (Centers for Medicare & Medicaid Services) oversees the nation’s major healthcare programs. Pretty important, right?',
    children: <span>Hover over me to learn about CMS</span>,
  },
}
