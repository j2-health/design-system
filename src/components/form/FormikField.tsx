import { FastField, Field, type FieldConfig, type FieldProps } from 'formik'
import { useContext, type ReactNode } from 'react'
import { FormItemFieldContext } from './FormItemFieldContext'

export type FormikFieldProps = Pick<FieldConfig, 'name' | 'validate'> & {
  fast?: boolean
}

export const FormikField = ({
  fast,
  children,
  ...props
}: FormikFieldProps & { children: (props: FieldProps) => ReactNode }) => {
  const itemField = useContext(FormItemFieldContext)
  if (itemField?.field.name === props.name) {
    return children(itemField)
  }
  const Component = fast ? FastField : Field
  return <Component {...props}>{children}</Component>
}
