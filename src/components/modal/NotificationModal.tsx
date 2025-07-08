import { ModalProps } from 'antd'
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { useMemo, ReactNode } from 'react'
import { Modal } from './Modal'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

export type NotificationModalProps = {
  type: NotificationType
  withContentPadding?: boolean
} & Omit<ModalProps, 'title'> & {
  title?: ReactNode
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'error':
      return (
        <XCircleIcon color="var(--j2-color-error)" weight="fill" size={24} />
      )
    case 'success':
      return (
        <CheckCircleIcon
          color="var(--j2-color-success)"
          weight="fill"
          size={24}
        />
      )
    case 'info':
      return <InfoIcon color="var(--j2-color-info)" weight="fill" size={24} />
    case 'warning':
      return (
        <WarningCircleIcon
          color="var(--j2-color-warning)"
          weight="fill"
          size={24}
        />
      )
  }
}

const NotificationModal = ({
  type,
  title,
  children,
  withContentPadding = true,
  ...props
}: NotificationModalProps) => {
  const icon = useMemo(() => getNotificationIcon(type), [type])

  const titleWithIcon = (
    <div className="modal-title-with-icon">
      <div className="modal-icon">{icon}</div>
      <div className="modal-title-content">
        <div className="modal-title-text">{title}</div>
      </div>
    </div>
  )

  return (
    <Modal
      title={titleWithIcon}
      type={type}
      withContentPadding={withContentPadding}
      {...props}
    >
      {children}
    </Modal>
  )
}

export { NotificationModal }