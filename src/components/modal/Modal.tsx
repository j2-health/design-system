import { Modal as AntdModal, ModalProps } from 'antd'
import { XIcon } from '@phosphor-icons/react'
import './Modal.css'
import cx from 'classnames'

export type Props = {
  withContentPadding?: boolean
  /** A line of supporting text under the title. */
  subtitle?: React.ReactNode
} & Expand<ModalProps>

const Modal = ({
  open,
  title,
  children,
  onCancel,
  withContentPadding: withPadding = true,
  subtitle,
  className,
  ...props
}: Props) => {
  return (
    <AntdModal
      title={
        subtitle ? (
          <div className="flex flex-col gap-1">
            <span>{title}</span>
            <span className="text-sm font-normal text-j2-text-secondary">
              {subtitle}
            </span>
          </div>
        ) : (
          title
        )
      }
      className={cx('j2-modal', className)}
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
