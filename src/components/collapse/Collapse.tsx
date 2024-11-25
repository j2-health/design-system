import { Collapse as AntdCollapse, CollapseProps } from 'antd'
import { CaretDown } from '@phosphor-icons/react'

export type Props = Expand<CollapseProps>

const Collapse = ({ ...props }: Props) => {
  return (
    <AntdCollapse
      {...props}
      expandIcon={({ isActive }) => (
        <CaretDown
          size={14}
          style={{ transform: `rotate(${isActive ? 0 : -90}deg)` }}
        />
      )}
    />
  )
}

export { Collapse }
