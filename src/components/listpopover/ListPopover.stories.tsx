import type { Meta, StoryObj } from '@storybook/react'
import { ListPopover } from './ListPopover'
import { useMessage } from '../message/useMessage'

const meta = {
  title: 'Components/ListPopover',
  component: ListPopover,
  args: {
    items: [
      'Plan 1',
      'Plan 2',
      'Plan 3',
      'Plan 4 is actually a really long plan name so it gets truncated',
    ],
    column: 'Known Plans',
    openMessage: () => {},
  },
  argTypes: {
    items: {
      control: 'object',
    },
    column: {
      control: 'text',
    },
  },
} satisfies Meta<typeof ListPopover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '# Plans',
  },
  render: (args) => {
    const { openMessage, contextHolder } = useMessage()

    return (
      <>
        {contextHolder}
        <ListPopover {...args} openMessage={openMessage} />
      </>
    )
  },
}
