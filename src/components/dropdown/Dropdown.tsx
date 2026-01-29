import { Dropdown as AntdDropdown, DropdownProps, Typography } from 'antd'
import cx from 'classnames'
import { Button } from '../button'
import { CaretDownIcon } from '@phosphor-icons/react'
import './Dropdown.css'

const { Link } = Typography

export type Props = DropdownProps & {
  type?: 'basic' | 'basic-inline' | 'twofold'
  label?: string
  icon?: React.ReactNode
  menuType?: 'default' | 'slim'
  targetClassName?: string
}

const LabelWithCaret = ({ label }: { label: string | undefined }) => (
  <div className="flex items-center gap-2">
    {label}
    <CaretDownIcon weight="regular" />
  </div>
)

const Target = ({ label, type, disabled, icon, className }: Props) => {
  if (type === 'basic-inline') {
    return (
      <Link disabled={disabled} className={cx('flex gap-1', className)}>
        {icon ? (
          <>
            {icon}
            {label}
          </>
        ) : (
          <LabelWithCaret label={label} />
        )}
      </Link>
    )
  }

  return (
    <Button disabled={disabled} icon={icon} className={className}>
      {icon ? label : <LabelWithCaret label={label} />}
    </Button>
  )
}

const Dropdown = ({
  label,
  type,
  icon,
  menu,
  menuType = 'default',
  targetClassName,
  ...props
}: Props) => {
  let menuProp = menu

  if (menuType === 'slim' && typeof menu === 'object') {
    menuProp = {
      ...menu,
      className: cx(menu.className, 'j2-dropdown-slim-menu'),
    }
  }

  if (type === 'twofold') {
    return (
      <AntdDropdown.Button {...props} menu={menuProp}>
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
    <AntdDropdown {...props} menu={menuProp}>
      <div>
        <Target
          label={label}
          type={type}
          disabled={props.disabled}
          icon={icon}
          className={targetClassName}
        />
      </div>
    </AntdDropdown>
  )
}

export { Dropdown }
