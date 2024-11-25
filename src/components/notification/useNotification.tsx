import { notification } from 'antd'
import type { NotificationArgsProps } from 'antd'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

export type OpenNotificationFunc = (
  type: Expand<NotificationType>,
  config: Expand<NotificationArgsProps>
) => void

export const useNotification = () => {
  const [api, contextHolder] = notification.useNotification()

  const openNotification: OpenNotificationFunc = (
    type: Expand<NotificationType>,
    config: Expand<NotificationArgsProps>
  ) => {
    api[type](config)
  }

  return { openNotification, contextHolder }
}
