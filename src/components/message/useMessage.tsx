import { message } from 'antd'

type NotificationType = 'success' | 'warning' | 'error'

export type OpenMessageFunc = (
  type: Expand<NotificationType>,
  messageContent: string
) => void

export const useMessage = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const openMessage: OpenMessageFunc = (
    type: Expand<NotificationType>,
    messageContent: string
  ) => {
    messageApi.open({
      type: type,
      content: messageContent,
    })
  }

  return { openMessage, contextHolder }
}
