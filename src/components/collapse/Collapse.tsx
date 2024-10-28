import { Collapse as AntdCollapse, CollapseProps } from 'antd'

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
    />
  )
}

export { Collapse }
