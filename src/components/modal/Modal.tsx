import { Modal as AntdModal, ModalProps } from 'antd'
import {
  XIcon,
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import './Modal.css'
import { useMemo } from 'react'
import cx from 'classnames'

type ModalType = 'default' | 'success' | 'info' | 'warning' | 'error'

export type Props = {
  type?: ModalType
} & Expand<ModalProps>

const getIcon = (type: ModalType) => {
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
    case 'default':
    default:
      return null
  }
}

const Modal = ({
  open,
  type = 'default',
  title,
  children,
  onCancel,
  ...props
}: Props) => {
  const icon = useMemo(() => getIcon(type), [type])

  return (
    <AntdModal
      title={
        icon ? (
          <div className="modal-title-with-icon">
            <div className="modal-icon">{icon}</div>
            <div className="modal-title-content">
              <div className="modal-title-text">{title}</div>
            </div>
          </div>
        ) : (
          title
        )
      }
      className={cx('j2-modal', { 'j2-modal-with-icon': icon })}
      maskClosable={true}
      centered
      closeIcon={<XIcon size={22} weight="regular" />}
      onCancel={onCancel}
      open={open}
      {...props}
    >
      <div
        className={cx('px-6 py-3', {
          'modal-content-with-icon': icon,
        })}
      >
        {children}
      </div>
    </AntdModal>
  )
}

export { Modal }
