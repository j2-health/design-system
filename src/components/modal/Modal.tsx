import { Modal as AntdModal, ModalProps } from 'antd'
import { XIcon } from '@phosphor-icons/react'
import './Modal.css'
import cx from 'classnames'

export type Props = {
  withContentPadding?: boolean
} & Expand<ModalProps>

const Modal = ({
  open,
  title,
  children,
  onCancel,
  withContentPadding: withPadding = true,
  ...props
}: Props) => {
  return (
    <AntdModal
      title={title}
      className={cx('j2-modal')}
      maskClosable={true}
      centered
      closeIcon={<XIcon size={22} weight="regular" />}
      onCancel={onCancel}
      open={open}
      {...props}
    >
      <div className={cx(withPadding ? 'px-6 py-3' : 'px-0 py-0')}>
        {children}
      </div>
    </AntdModal>
  )
}

export { Modal }
