import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './Tag'

const meta = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Tag',
  },
}

export const Closable: Story = {
  args: {
    children: 'Tag',
    closable: true,
  },
}

export const Green: Story = {
  args: {
    children: 'Tag',
    color: 'green',
  },
}
