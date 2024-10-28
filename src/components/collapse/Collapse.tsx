import { Collapse as AntdCollapse, CollapseProps } from 'antd'
import { CaretDown } from '@phosphor-icons/react'

export type Props = CollapseProps & {
  /** Default active key */
  defaultActiveKey?: string | string[]
  /** Expand icon position */
  expandIconPosition?: 'start' | 'end'
}

const Collapse = ({
  defaultActiveKey,
  expandIconPosition,
  ...props
}: Props) => {
  return (
    <AntdCollapse
      {...props}
      defaultActiveKey={defaultActiveKey}
      expandIconPosition={expandIconPosition}
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
