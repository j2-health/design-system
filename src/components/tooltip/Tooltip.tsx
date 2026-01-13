import { Tooltip as AntdTooltip, TooltipProps } from 'antd'

export type Props = Expand<TooltipProps>

const Tooltip = ({
  children,
  placement = 'top',
  arrow = false,
  ...props
}: Props) => {
  return (
    <AntdTooltip {...props} placement={placement} arrow={arrow}>
      <div>{children}</div>
    </AntdTooltip>
  )
}

export { Tooltip }
