import { Drawer as AntdDrawer, DrawerProps, Space } from 'antd'
import { Button } from '../button'
import { XIcon } from '@phosphor-icons/react'
import './Drawer.css'

type AllProps = Omit<DrawerProps, 'extra' | 'closable'> & {
  fillPage?: boolean
  footer?: React.ReactNode
  extraContent?: React.ReactNode
}

export type Props = Expand<AllProps>

export const Drawer = ({
  fillPage = false,
  footer,
  extraContent,
  ...props
}: Props) => {
  return (
    <AntdDrawer
      {...props}
      closable={false}
      {...(fillPage && { height: '100vh', width: '100vw' })}
      {...(footer && { footer })}
      extra={
        <Space>
          {extraContent}
          <Button
            className="p-0"
            type="link"
            onClick={props.onClose}
            aria-label="Close"
          >
            <XIcon size={22} weight="regular" />
          </Button>
        </Space>
      }
      className="j2-drawer"
    />
  )
}
