import { Popover as AntdPopover, PopoverProps as AntdPopoverProps } from 'antd'
import cx from 'classnames'
import styles from './Popover.module.css'

type _Props = AntdPopoverProps & {
  contentPadding?: boolean
  scrollable?: boolean
}

export type PopoverProps = Expand<_Props>

const Popover = ({
  children,
  placement = 'top',
  scrollable = false,
  contentPadding = true,
  content,
  ...props
}: PopoverProps) => {
  return (
    <AntdPopover
      overlayClassName={cx(styles.j2Popover, scrollable && styles.scrollable)}
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
