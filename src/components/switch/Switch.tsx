import { Switch as AntSwitch, SwitchProps } from 'antd'
import './Switch.css'

type AllProps = SwitchProps & {
  small?: boolean
  loading?: boolean
  disabled?: boolean
}

export type Props = Expand<AllProps>

export const Switch = ({
  small,
  loading = false,
  disabled = false,
  ...props
}: Props) => {
  return (
    <AntSwitch
      {...props}
      size={small ? 'small' : 'default'}
      loading={loading}
      disabled={disabled}
      className="j2-switch"
    />
  )
}
