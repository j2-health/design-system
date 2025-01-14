import { Tabs as AntdTabs, TabsProps } from 'antd'

export type Props = Expand<TabsProps>

export const Tabs = (props: Props) => {
  const destroyInactiveTabPane = props.destroyInactiveTabPane ?? true
  return <AntdTabs {...props} destroyInactiveTabPane={destroyInactiveTabPane} />
}
