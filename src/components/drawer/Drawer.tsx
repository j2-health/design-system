import { Drawer as AntdDrawer, DrawerProps, Space } from 'antd'
import { Button } from '../button'
import { XIcon } from '@phosphor-icons/react'
import './Drawer.css'

type AllProps = DrawerProps & {
  placement?: 'top' | 'bottom' | 'left' | 'right'
  fillPage?: boolean
  footer?: React.ReactNode
}

export type Props = Expand<AllProps>

export const Drawer = ({
  placement = 'bottom',
  fillPage = false,
  footer,
  ...props
}: Props) => {
  return (
    <AntdDrawer
      {...props}
      closable={false}
      placement={placement}
      {...(fillPage && { height: '100vh', width: '100vw' })}
      {...(footer && { footer })}
      extra={
        <Space>
          <Button type="link" onClick={props.onClose}>
            <XIcon size={22} weight="regular" />
          </Button>
        </Space>
      }
      className="j2-drawer"
    />
  )
}
