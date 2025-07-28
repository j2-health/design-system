import { Collapse as AntdCollapse, CollapseProps } from 'antd'
import { CaretDownIcon } from '@phosphor-icons/react'

export type Props = Expand<CollapseProps>

const Collapse = ({ ...props }: Props) => {
  return (
    <AntdCollapse
      {...props}
      expandIcon={({ isActive }) => (
        <CaretDownIcon
          size={14}
          style={{ transform: `rotate(${isActive ? 0 : -90}deg)` }}
        />
      )}
    />
  )
}

export { Collapse }
