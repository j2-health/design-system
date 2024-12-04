import { Menu as AntdMenu, MenuProps as AntdMenuProps } from 'antd'
import styles from './Menu.module.css'
import cx from 'classnames'

type Props = Expand<AntdMenuProps> & {
  compact?: boolean
}

const Menu = ({ compact = false, ...props }: Props) => {
  return (
    <AntdMenu
      className={cx(styles.j2Menu, compact && styles.compact)}
      {...props}
      inlineCollapsed={compact}
    />
  )
}

export { Menu }
export type { Props as MenuProps }
