import { Form as AntdForm, type FormItemProps as AntdFormItemProps } from 'antd'
import { getIn, useFormikContext } from 'formik'
import type { ReactNode } from 'react'
import { FormikField, type FormikFieldProps } from './FormikField'
import { FormItemFieldContext } from './FormItemFieldContext'

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
}: Props) => {
  const form = useFormikContext()
  const error = getIn(form.errors, name)
  const initialError = getIn(form.initialErrors, name)
  const touched = getIn(form.touched, name, false)
  const isTouched = Array.isArray(touched)
    ? touched.length === 0 || touched.some(Boolean)
    : touched
  const hasError = error !== undefined && isTouched
  const showInitialError =
    initialError !== undefined && (!isTouched || showInitialErrorAfterTouched)
  const isValid = !error && isTouched

  const item = (
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
  // Display-only items must not register a second field over their control.
  // When validate is supplied, the item owns validation (as before).
  return validate ? (
    <FormikField name={name} validate={validate}>
      {(fieldProps) => (
        <FormItemFieldContext.Provider value={fieldProps}>
          {item}
        </FormItemFieldContext.Provider>
      )}
    </FormikField>
  ) : (
    item
  )
}
