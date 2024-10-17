import type { Meta, StoryObj } from '@storybook/react'
import { useNotification } from './useNotification'
import { Button, NotificationArgsProps, Space } from 'antd'

const meta = {
  title: 'Hooks/Notification',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    message: { control: 'text' },
    description: { control: 'text' },
    placement: {
      control: 'radio',
      options: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
    },
    type: {
      control: 'radio',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
  args: {
    message: 'Default Message',
  },
} satisfies Meta<typeof useNotification>

export default meta
type Story = StoryObj<typeof meta>

type NotificationDemoProps = Exclude<NotificationArgsProps, 'btn'> & {
  message: string
  description: string
  placement:
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
  type: 'info' | 'success' | 'warning' | 'error'
}

const NotificationDemo = ({
  message,
  description,
  placement,
  type,
}: NotificationDemoProps) => {
  const { openNotification, contextHolder } = useNotification()

  const openCustomNotification = () => {
    openNotification(type, {
      message,
      description,
      placement,
    })
  }

  return (
    <>
      {contextHolder}
      <Space direction="vertical">
        <Button type="primary" onClick={openCustomNotification}>
          Show Notification
        </Button>
      </Space>
    </>
  )
}

export const Default: Story = {
  args: {
    message: 'Default Notification Title',
    description: 'This is the default content of the notification.',
    placement: 'topRight',
    type: 'info',
  },
  render: (args) => <NotificationDemo {...(args as NotificationDemoProps)} />,
  parameters: {
    docs: {
      description: {
        story:
          '`<NotificationDemo />` demonstrates the use of the `useNotification` hook to display notifications. Refer to the source code for further details.',
      },
    },
  },
}

const NotificationDemoWithButtons = ({
  message,
  description,
  placement,
  type,
}: NotificationDemoProps) => {
  const { openNotification, contextHolder } = useNotification()

  const openCustomNotification = () => {
    openNotification(type, {
      message,
      description,
      placement,
      btn: (
        <Space>
          <Button type="primary" size="small">
            Accept
          </Button>
          <Button size="small">Decline</Button>
        </Space>
      ),
    })
  }

  return (
    <>
      {contextHolder}
      <Space direction="vertical">
        <Button type="primary" onClick={openCustomNotification}>
          Show Notification with Buttons
        </Button>
      </Space>
    </>
  )
}

export const WithButtons: Story = {
  args: {
    message: 'Notification with Buttons Title',
    description: 'This notification includes custom buttons.',
    placement: 'bottomLeft',
    type: 'warning',
  },
  render: (args) => (
    <NotificationDemoWithButtons {...(args as NotificationDemoProps)} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`<NotificationDemoWithButtons />` demonstrates the use of the `useNotification` hook to display notifications with custom buttons. Refer to the source code for further details.',
      },
    },
  },
}
