import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    active: {
      control: 'boolean',
    },
    paragraph: {
      control: 'object',
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Skeleton {...args} />
    </div>
  ),
  args: {
    active: true,
    paragraph: { rows: 4 },
  },
}
