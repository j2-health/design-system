import { Form as AntdForm, type FormItemProps as AntdFormItemProps } from 'antd'
import { getIn } from 'formik'
import type { ReactNode } from 'react'
import { FormikField, type FormikFieldProps } from './FormikField'

type Props = Omit<AntdFormItemProps, 'name' | 'children'> &
  Pick<FormikFieldProps, 'name' | 'validate'> & {
    children: ReactNode
    showValidateSuccess?: boolean
    showInitialErrorAfterTouched?: boolean
  }

export const FormItem = ({
  name,
  validate,
  children,
  showValidateSuccess,
  showInitialErrorAfterTouched = false,
  ...props
}: Props) => (
  <FormikField name={name} validate={validate}>
    {({ form }) => {
      const error = getIn(form.errors, name)
      const initialError = getIn(form.initialErrors, name)
      const touched = getIn(form.touched, name, false)
      const isTouched = Array.isArray(touched)
        ? touched.length === 0 || touched.some(Boolean)
        : touched
      const hasError = error !== undefined && isTouched
      const showInitialError =
        initialError !== undefined &&
        (!isTouched || showInitialErrorAfterTouched)
      const isValid = !error && isTouched

      return (
        <AntdForm.Item
          htmlFor={name}
          id={name}
          validateStatus={
            hasError || (initialError !== undefined && !isTouched)
              ? 'error'
              : isValid && showValidateSuccess
                ? 'success'
                : undefined
          }
          hasFeedback={isValid}
          help={
            hasError || showInitialError ? (
              <>
                {hasError && <li>{error}</li>}
                {showInitialError && <li>{initialError}</li>}
              </>
            ) : null
          }
          {...props}
        >
          {/* Formik owns values and validation; do not register an antd field. */}
          {children}
        </AntdForm.Item>
      )
    }}
  </FormikField>
)
