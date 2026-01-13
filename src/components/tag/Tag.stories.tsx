import type { Meta, StoryObj } from '@storybook/react'
import { Tag } from './Tag'
import { ChefHatIcon, TagIcon } from '@phosphor-icons/react'

const meta = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  args: {
    status: 'default',
    showIcon: true,
  },
  argTypes: {
    status: {
      control: 'radio',
      options: ['default', 'error', 'success', 'warning', 'processing'],
    },
    showIcon: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Tag',
    status: 'default',
    showIcon: true,
  },
}

export const NoIcon: Story = {
  args: {
    children: 'Tag',
    status: 'default',
    showIcon: false,
  },
}

export const CustomIcon: Story = {
  args: {
    children: 'Look at me, I have a hat!',
    status: 'default',
    showIcon: true,
    icon: ChefHatIcon,
  },
}

export const InsideFlexContainer: Story = {
  args: {
    children: 'Tagged tag',
    status: 'default',
    showIcon: true,
    icon: TagIcon,
  },
  render: (args) => (
    <div style={{ display: 'flex' }}>
      <Tag {...args} />
    </div>
  ),
}
