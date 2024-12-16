import { Checkbox as AntdCheckbox, CheckboxProps } from 'antd'

type Props = Expand<CheckboxProps>

export const Checkbox = (props: Props) => {
  return <AntdCheckbox {...props} />
}

Checkbox.Group = AntdCheckbox.Group
