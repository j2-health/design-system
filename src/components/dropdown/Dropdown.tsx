import { Dropdown as AntdDropdown, DropdownProps, Typography } from 'antd'
import { Button } from '../button'
import { CaretDownIcon } from '@phosphor-icons/react'
import './Dropdown.css'

const { Link } = Typography

type CombinedProps = DropdownProps & {
  type?: 'basic' | 'basic-inline' | 'twofold'
  label: string
}

export type Props = Expand<CombinedProps>

const Label = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2">
    {label}
    <CaretDownIcon weight="regular" />
  </div>
)

const Target = ({ label, type, disabled }: Props) => {
  if (type === 'basic-inline') {
    return (
      <Link disabled={disabled}>
        <Label label={label} />
      </Link>
    )
  }

  return (
    <Button disabled={disabled}>
      <Label label={label} />
    </Button>
  )
}

const Dropdown = ({ label, type, ...props }: Props) => {
  if (type === 'twofold') {
    return <AntdDropdown.Button {...props}>{label}</AntdDropdown.Button>
  }

  return (
    <AntdDropdown {...props}>
      <div>
        <Target label={label} type={type} disabled={props.disabled} />
      </div>
    </AntdDropdown>
  )
}

export { Dropdown }
