import { Dropdown as AntdDropdown, DropdownProps, Typography } from 'antd'
import { Button } from '../button'

const { Link } = Typography

type CombinedProps = DropdownProps & {
  type?: 'basic' | 'basic-inline' | 'twofold'
  label: string
}

export type Props = Expand<CombinedProps>

const Target = ({ label, type }: Props) => {
  if (type === 'basic-inline') {
    return <Link>{label}</Link>
  }

  return <Button type="primary">{label}</Button>
}

const Dropdown = ({ label, type, ...props }: Props) => {
  if (type === 'twofold') {
    return <AntdDropdown.Button {...props}>{label}</AntdDropdown.Button>
  }

  return (
    <AntdDropdown {...props}>
      <div>
        <Target label={label} type={type} />
      </div>
    </AntdDropdown>
  )
}

export { Dropdown }
