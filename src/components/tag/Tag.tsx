import { Tag as AntdTag, TagProps } from 'antd'

type Props = Expand<TagProps>

export const Tag = (props: Props) => {
  return <AntdTag {...props} />
}
