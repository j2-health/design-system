import { Select as AntDSelect } from 'antd'
import type { SelectProps as AntDSelectProps } from 'antd'

type SelectProps = Expand<AntDSelectProps>

export const Select = (props: SelectProps) => {
  return <AntDSelect {...props} />
}
