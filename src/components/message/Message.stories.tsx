import type { Meta, StoryObj } from '@storybook/react'
import { useMessage } from './useMessage'
import { Space, Button } from 'antd'

const meta = {
  title: 'Hooks/Message',
  argTypes: {
    type: { control: 'text' },
    messageContent: { control: 'text' },
  },
  args: {
    type: 'success',
    messageContent: 'This was a success!',
  },
} satisfies Meta<typeof useMessage>

export default meta
type Story = StoryObj<typeof meta>

type MessageDemoProps = {
  type: 'success' | 'warning' | 'error'
  messageContent: string
}

const MessageDemo = ({ type, messageContent }: MessageDemoProps) => {
  const { openMessage, contextHolder } = useMessage()

  const openCustomMessage = () => {
    openMessage(type, messageContent)
  }

  return (
    <>
      {contextHolder}
      <Space direction="vertical">
        <Button type="primary" onClick={openCustomMessage}>
          Optimize Network
        </Button>
      </Space>
    </>
  )
}

export const Default: Story = {
  args: {
    type: 'success',
    messageContent: 'This was a success',
  },
  render: (args) => <MessageDemo {...(args as MessageDemoProps)} />,
  parameters: {
    docs: {
      description: {
        story:
          '`<MessageDemo />` demonstrates the use of the `useMessage` hook to display messages. Refer to the source code for further details.',
      },
    },
  },
}
