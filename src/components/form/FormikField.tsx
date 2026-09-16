import { FastField, Field, type FieldConfig, type FieldProps } from 'formik'
import type { ReactNode } from 'react'

export type FormikFieldProps = Pick<FieldConfig, 'name' | 'validate'> & {
  fast?: boolean
}

export const FormikField = ({
  fast,
  children,
  ...props
}: FormikFieldProps & { children: (props: FieldProps) => ReactNode }) => {
  const Component = fast ? FastField : Field
  return <Component {...props}>{children}</Component>
}
