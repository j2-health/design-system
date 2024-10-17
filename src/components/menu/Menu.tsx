import { Menu as AntdMenu, MenuProps as AntdMenuProps } from 'antd'

type Props = Expand<AntdMenuProps>

const Menu = (props: Props) => {
  return <AntdMenu {...props} />
}

export { Menu }
