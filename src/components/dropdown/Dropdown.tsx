import { Dropdown as AntdDropdown, DropdownProps, Typography } from 'antd'
import { Button } from '../button'
import { CaretDownIcon } from '@phosphor-icons/react'
import './Dropdown.css'

const { Link } = Typography

export type Props = DropdownProps & {
  type?: 'basic' | 'basic-inline' | 'twofold'
  label?: string
  icon?: React.ReactNode
}

const Label = ({ label }: { label: string | undefined }) => (
  <div className="flex items-center gap-2">
    {label}
    <CaretDownIcon weight="regular" />
  </div>
)

const Target = ({ label, type, disabled, icon }: Props) => {
  if (type === 'basic-inline') {
    return (
      <Link disabled={disabled}>
        {icon ? (
          <>
            {icon}
            {label}
          </>
        ) : (
          <Label label={label} />
        )}
      </Link>
    )
  }

  return (
    <Button disabled={disabled} icon={icon}>
      {icon ? label : <Label label={label} />}
    </Button>
  )
}

const Dropdown = ({ label, type, icon, ...props }: Props) => {
  if (type === 'twofold') {
    return (
      <AntdDropdown.Button {...props}>
        {icon ? (
          <>
            {icon} {label}
          </>
        ) : (
          label
        )}
      </AntdDropdown.Button>
    )
  }

  return (
    <AntdDropdown {...props}>
      <div>
        <Target
          label={label}
          type={type}
          disabled={props.disabled}
          icon={icon}
        />
      </div>
    </AntdDropdown>
  )
}

export { Dropdown }
