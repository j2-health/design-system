import { message } from 'antd'
import styles from './Message.module.css'
import cx from 'classnames'
import { CheckCircle, WarningCircle, XCircle } from '@phosphor-icons/react'

type NotificationType = 'success' | 'warning' | 'error'

export type OpenMessageFunc = (
  type: Expand<NotificationType>,
  messageContent: string
) => void

const getIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return (
        <CheckCircle
          weight="fill"
          color="var(--j2-color-success)"
          size={16}
          className={cx(styles.messageIcon)}
        />
      )
    case 'warning':
      return (
        <WarningCircle
          weight="fill"
          color="var(--j2-color-warning)"
          size={16}
          className={cx(styles.messageIcon)}
        />
      )
    case 'error':
      return (
        <XCircle
          weight="fill"
          color="var(--j2-color-error)"
          size={16}
          className={cx(styles.messageIcon)}
        />
      )
  }
}

export const useMessage = () => {
  const [messageApi, contextHolder] = message.useMessage()

  const openMessage: OpenMessageFunc = (
    type: Expand<NotificationType>,
    messageContent: string
  ) => {
    messageApi.open({
      type: type,
      icon: getIcon(type),
      content: messageContent,
      className: cx({ styles }),
    })
  }

  return { openMessage, contextHolder }
}
