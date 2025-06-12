import { Popover as AntdPopover, PopoverProps as AntdPopoverProps } from 'antd'
import cx from 'classnames'
import styles from './Popover.module.css'

type _Props = AntdPopoverProps & {
  contentPadding?: boolean
  scrollable?: boolean
  smallPadding?: boolean
}

export type PopoverProps = Expand<_Props>

const Popover = ({
  children,
  placement = 'top',
  scrollable = false,
  contentPadding = true,
  content,
  smallPadding = false,
  ...props
}: PopoverProps) => {
  return (
    <AntdPopover
      overlayClassName={cx(
        styles.j2Popover,
        scrollable && styles.scrollable,
        smallPadding && styles.smallPadding
      )}
      {...props}
      placement={placement}
      content={() => {
        if (!contentPadding) {
          return <div>{typeof content == 'function' ? content() : content}</div>
        }

        return typeof content == 'function' ? content() : content
      }}
    >
      <div>{children}</div>
    </AntdPopover>
  )
}

export { Popover }
