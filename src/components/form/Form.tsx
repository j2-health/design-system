import { Form as AntdForm, type FormProps } from 'antd'
import { useFormikContext } from 'formik'
import type { ReactNode } from 'react'
import { FormItem } from './FormItem'
import './Form.css'

type Props = Expand<Omit<FormProps, 'children'> & { children?: ReactNode }>

export const Form = ({ children, onFinish, onReset, ...props }: Props) => {
  const { handleSubmit, handleReset } = useFormikContext()
  return (
    <AntdForm
      {...props}
      onFinish={(values) => {
        handleSubmit()
        onFinish?.(values)
      }}
      onReset={(event) => {
        handleReset(event)
        onReset?.(event)
      }}
    >
      {children}
    </AntdForm>
  )
}

Form.Item = FormItem
