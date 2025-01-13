import { Popover as AntdPopover, PopoverProps as AntdPopoverProps } from 'antd'
import cx from 'classnames'
import styles from './Popover.module.css'

type _Props = AntdPopoverProps & {
  contentPadding?: boolean
}

export type PopoverProps = Expand<_Props>

const Popover = ({
  children,
  placement = 'top',
  contentPadding = true,
  content,
  ...props
}: PopoverProps) => {
  return (
    <AntdPopover
      overlayClassName={styles.j2Popover}
      {...props}
      placement={placement}
      content={() => {
        if (!contentPadding) {
          return (
            <div className="-m-6">
              {typeof content == 'function' ? content() : content}
            </div>
          )
        }

        return typeof content == 'function' ? content() : content
      }}
    >
      {children}
    </AntdPopover>
  )
}

const PopoverHeader = ({ title }: { title: string }) => {
  return (
    <div
      className={cx(
        'py-2 px-3 items-center flex justify-between',
        styles.popoverHeader
      )}
    >
      {title}
    </div>
  )
}

export { Popover, PopoverHeader }
