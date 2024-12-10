import { Tabs as AntdTabs, TabsProps } from 'antd'

export type Props = Expand<TabsProps>

export const Tabs = (props: Props) => {
  return <AntdTabs {...props} />
}
