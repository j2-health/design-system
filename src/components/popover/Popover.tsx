import { Popover as AntdPopover, PopoverProps } from 'antd'

export type Props = Expand<PopoverProps>

const Popover = ({ children, placement = 'top', ...props }: Props) => {
  return (
    <AntdPopover {...props} placement={placement}>
      {children}
    </AntdPopover>
  )
}

export { Popover }
