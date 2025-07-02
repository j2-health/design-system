import { Modal as AntdModal, ModalProps } from 'antd'
import {
  XIcon,
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { Button } from '../button'
import './Modal.css'
import { useMemo } from 'react'
import cx from 'classnames'

type ModalType = 'default' | 'success' | 'info' | 'warning' | 'error'

export type Props = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  showCancel?: boolean
  showOk?: boolean
  cancelText?: string
  okText?: string
  onOk?: () => void
  type?: ModalType
} & Omit<ModalProps, 'open' | 'onCancel' | 'children'>

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
  isOpen,
  onClose,
  children,
  title = 'Modal title',
  showCancel = true,
  showOk = true,
  cancelText = 'Cancel',
  okText = 'Ok',
  onOk,
  type = 'default',
  ...props
}: Props) => {
  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    if (onOk) {
      onOk()
    } else {
      onClose()
    }
  }

  const icon = useMemo(() => getIcon(type), [type])

  return (
    <AntdModal
      {...props}
      open={isOpen}
      onCancel={handleCancel}
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
      footer={
        showCancel || showOk ? (
          <div
            className={cx('modal-footer', {
              'modal-footer-with-icon': icon,
            })}
          >
            {showCancel && (
              <Button type="default" onClick={handleCancel}>
                {cancelText}
              </Button>
            )}
            {showOk && (
              <Button type="primary" onClick={handleOk}>
                {okText}
              </Button>
            )}
          </div>
        ) : null
      }
      className={cx('j2-modal', { 'j2-modal-with-icon': icon })}
      maskClosable={true}
      centered
      closeIcon={<XIcon size={22} weight="regular" />}
    >
      <div
        className={cx('modal-content', {
          'modal-content-with-icon': icon,
        })}
      >
        {children}
      </div>
    </AntdModal>
  )
}

export { Modal }
