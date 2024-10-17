import { notification } from 'antd'
import type { NotificationArgsProps } from 'antd'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

export const useNotification = () => {
  const [api, contextHolder] = notification.useNotification()

  const openNotification = (
    type: NotificationType,
    config: NotificationArgsProps
  ) => {
    api[type](config)
  }

  return { openNotification, contextHolder }
}
