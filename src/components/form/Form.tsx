import { FormProps } from 'antd'
import { Form as AntdForm, FormItem } from 'formik-antd'
import './Form.css'

type Props = Expand<FormProps>

export const Form = ({ children, ...props }: Props) => {
  return <AntdForm {...props}>{children}</AntdForm>
}

Form.Item = FormItem
