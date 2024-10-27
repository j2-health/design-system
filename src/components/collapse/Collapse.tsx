import { Collapse as AntdCollapse, CollapseProps } from 'antd'

export type Props = CollapseProps & {
  /** Collapse contents */
  children: React.ReactNode
  /** Active key */
  activeKey?: string | string[]
}

const Collapse = ({ children, activeKey, ...props }: Props) => {
  return (
    <AntdCollapse {...props} activeKey={activeKey}>
      {children}
    </AntdCollapse>
  )
}

export { Collapse }
