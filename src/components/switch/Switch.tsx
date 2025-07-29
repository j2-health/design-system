import { Switch as AntSwitch, SwitchProps } from 'antd'
import './Switch.css'

type AllProps = SwitchProps & {
  small?: boolean
  loading?: boolean
  disabled?: boolean
  checked?: boolean
  onChange?: (checked: boolean, event: Event) => void
}

export type Props = Expand<AllProps>

export const Switch = ({
  small,
  loading = false,
  disabled = false,
  checked,
  onChange,
  ...props
}: Props) => {
  return (
    <AntSwitch
      {...props}
      size={small ? 'small' : 'default'}
      loading={loading}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
      className="j2-switch"
    />
  )
}
