import { Popover as AntdPopover, PopoverProps } from 'antd'
import styles from './Popover.module.css'
export type Props = Expand<PopoverProps>

const Popover = ({ children, placement = 'top', ...props }: Props) => {
  return (
    <AntdPopover
      overlayClassName={styles.j2Popover}
      {...props}
      placement={placement}
    >
      {children}
    </AntdPopover>
  )
}

export { Popover }
