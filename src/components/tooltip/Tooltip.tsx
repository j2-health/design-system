import { Tooltip as AntdTooltip, TooltipProps } from 'antd'

export type Props = Expand<TooltipProps>

const Tooltip = ({ children, placement = 'top', ...props }: Props) => {
  return (
    <AntdTooltip {...props} placement={placement}>
      {children}
    </AntdTooltip>
  )
}

export { Tooltip }
