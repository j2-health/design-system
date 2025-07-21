import { notification } from 'antd'
import type { NotificationArgsProps } from 'antd'
import s from './Notification.module.css'
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import cx from 'classnames'
import React from 'react'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

export type OpenNotificationFunc = (
  type: Expand<NotificationType>,
  config: Expand<NotificationArgsProps>
) => void

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'error':
      return (
        <XCircleIcon color="var(--j2-color-error)" weight="duotone" size={24} />
      )
    case 'success':
      return (
        <CheckCircleIcon
          color="var(--j2-color-success)"
          weight="duotone"
          size={24}
        />
      )
    case 'info':
      return (
        <InfoIcon color="var(--j2-color-info)" weight="duotone" size={24} />
      )
    case 'warning':
      return (
        <WarningCircleIcon
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
      closeIcon: (
        <XIcon color="var(--j2-color-icon)" size={22} weight="regular" />
      ),
      className: cx({
        [s.messageOnly]: config.message && !config.description,
      }),
    })
  }

  const closeNotification = (key?: React.Key) => {
    api.destroy(key)
  }

  return { openNotification, closeNotification, contextHolder }
}
