import { Tabs as AntdTabs, TabsProps } from 'antd'

export type Props = Expand<TabsProps>

export const Tabs = (props: Props) => {
  const destroyOnHidden = props.destroyOnHidden ?? true
  return <AntdTabs {...props} destroyOnHidden={destroyOnHidden} />
}
