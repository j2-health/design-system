import { Switch as AntSwitch, SwitchProps } from 'antd'
import cx from 'classnames'
import './Switch.css'

type AllProps = SwitchProps & {
  small?: boolean
  loading?: boolean
  disabled?: boolean
  checked?: boolean
  onChange?: (checked: boolean, event: Event) => void
}

export type Props = Expand<AllProps>

const isText = (node: React.ReactNode) =>
  typeof node === 'string' || typeof node === 'number'

export const Switch = ({
  small,
  size,
  className,
  loading = false,
  disabled = false,
  checked,
  onChange,
  ...props
}: Props) => {
  return (
    <AntSwitch
      {...props}
      size={small ? 'small' : (size ?? 'default')}
      loading={loading}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
      className={cx(
        'j2-switch',
        (isText(props.checkedChildren) || isText(props.unCheckedChildren)) &&
          'j2-switch-labelled',
        className
      )}
    />
  )
}
