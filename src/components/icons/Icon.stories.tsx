import type { Meta, StoryObj } from '@storybook/react'
import { MagnifyingGlass, ArrowDown } from '@phosphor-icons/react'

const IconExample = () => {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <MagnifyingGlass />
      <ArrowDown />
    </div>
  )
}

const meta = {
  title: 'Icons',
  component: IconExample,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof IconExample>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
