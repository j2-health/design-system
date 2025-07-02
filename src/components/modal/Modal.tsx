import { Modal as AntdModal, ModalProps } from 'antd'
import { XIcon } from '@phosphor-icons/react'
import { Button } from '../button'
import './Modal.css'

export type Props = {
  /** Controls whether the modal is visible */
  isOpen: boolean
  /** Callback function called when the modal needs to be closed */
  onClose: () => void
  /** Modal content */
  children: React.ReactNode
  /** Modal title */
  title?: string
  /** Show cancel button in footer */
  showCancel?: boolean
  /** Show OK button in footer */
  showOk?: boolean
  /** Cancel button text */
  cancelText?: string
  /** OK button text */
  okText?: string
  /** Callback for OK button click */
  onOk?: () => void
} & Omit<ModalProps, 'open' | 'onCancel' | 'children'>

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

  return (
    <AntdModal
      {...props}
      open={isOpen}
      onCancel={handleCancel}
      title={title}
      footer={
        showCancel || showOk ? (
          <div className="modal-footer">
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
      className="j2-modal"
      maskClosable={true}
      centered
      closeIcon={<XIcon size={22} weight="regular" />}
    >
      {children}
    </AntdModal>
  )
}

export { Modal }
