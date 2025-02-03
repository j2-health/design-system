import { notification } from 'antd'
import type { NotificationArgsProps } from 'antd'
import s from './Notification.module.css'
import {
  CheckCircle,
  Info,
  WarningCircle,
  X,
  XCircle,
} from '@phosphor-icons/react'
import cx from 'classnames'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

export type OpenNotificationFunc = (
  type: Expand<NotificationType>,
  config: Expand<NotificationArgsProps>
) => void

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'error':
      return (
        <XCircle color="var(--j2-color-error)" weight="duotone" size={24} />
      )
    case 'success':
      return (
        <CheckCircle
          color="var(--j2-color-success)"
          weight="duotone"
          size={24}
        />
      )
    case 'info':
      return <Info color="var(--j2-color-info)" weight="duotone" size={24} />
    case 'warning':
      return (
        <WarningCircle
          color="var(--j2-color-warning)"
          weight="duotone"
          size={24}
        />
      )
  }
}

export const useNotification = () => {
  const [api, contextHolder] = notification.useNotification()

  const openNotification: OpenNotificationFunc = (
    type: Expand<NotificationType>,
    config: Expand<NotificationArgsProps>
  ) => {
    api[type]({
      icon: getIcon(type),
      ...config,
      closeIcon: <X color="var(--j2-color-icon)" size={22} weight="regular" />,
      className: cx({
        [s.messageOnly]: config.message && !config.description,
      }),
    })
  }

  return { openNotification, contextHolder }
}
