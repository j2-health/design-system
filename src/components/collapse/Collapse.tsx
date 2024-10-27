import { Collapse as AntdCollapse, CollapseProps } from 'antd'

export type Props = CollapseProps & {
  /** Active key */
  activeKey?: string | string[]
  /** Default active key */
  defaultActiveKey?: string | string[]
  /** Expand icon position */
  expandIconPosition?: 'start' | 'end'
}

const Collapse = ({
  activeKey,
  defaultActiveKey,
  expandIconPosition,
  ...props
}: Props) => {
  return (
    <AntdCollapse
      {...props}
      activeKey={activeKey}
      defaultActiveKey={defaultActiveKey}
      expandIconPosition={expandIconPosition}
    />
  )
}

export { Collapse }
