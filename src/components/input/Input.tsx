import { Input as AntdInput, type InputProps } from 'antd'
import { FormikField, type FormikFieldProps } from '../form/FormikField'
type Props = Expand<InputProps & FormikFieldProps>

export const Input = ({
  size = 'large',
  name,
  validate,
  fast,
  onChange,
  onBlur,
  ...props
}: Props) => {
  return (
    <FormikField name={name} validate={validate} fast={fast}>
      {({ field }) => (
        <AntdInput
          size={size}
          name={name}
          id={name}
          {...props}
          value={field.value}
          onChange={(event) => {
            field.onChange(event)
            onChange?.(event)
          }}
          onBlur={(event) => {
            field.onBlur(event)
            onBlur?.(event)
          }}
        />
      )}
    </FormikField>
  )
}
