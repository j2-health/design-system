import { Menu as AntdMenu, MenuProps as AntdMenuProps } from 'antd'
import styles from './Menu.module.css'

type Props = Expand<AntdMenuProps>

const Menu = (props: Props) => {
  return <AntdMenu className={styles.j2Menu} {...props} />
}

export { Menu }
