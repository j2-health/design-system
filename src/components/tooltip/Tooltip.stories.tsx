import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tooltip } from './Tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  args: {
    placement: 'top',
    arrow: true,
  },
  argTypes: {
    placement: {
      control: 'radio',
      options: ['top', 'right', 'bottom', 'left'],
    },
    arrow: {
      control: 'boolean',
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
