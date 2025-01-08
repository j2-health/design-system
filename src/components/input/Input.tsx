import { Input as FormikAntdInput, InputProps } from 'formik-antd'
type Props = Expand<InputProps>

export const Input = ({ size = 'large', ...props }: Props) => {
  return <FormikAntdInput size={size} {...props} />
}
