import { InputNumber as AntdInputNumber, type InputNumberProps } from 'antd'
import { FormikField, type FormikFieldProps } from '../form/FormikField'
import cx from 'classnames'
import styles from './InputNumber.module.css'
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
type Props = Expand<InputNumberProps & FormikFieldProps> & {
  name: string
  max?: number
  min?: number
  step?: number
}

export const InputNumber = ({
  size = 'large',
  step = 1,
  name,
  max,
  min,
  validate,
  fast,
  onChange,
  onBlur,
  ...props
}: Props) => {
  return (
    <FormikField name={name} validate={validate} fast={fast}>
      {({ field, form }) => (
        <AntdInputNumber
          name={name}
          id={name}
          max={max}
          min={min}
          step={step}
          className={cx(styles.j2InputNumber, props.className)}
          upHandler={<CaretUpIcon weight="bold" size={12} />}
          downHandler={<CaretDownIcon weight="bold" size={12} />}
          size={size}
          {...props}
          value={field.value}
          onChange={(value) => {
            void form.setFieldValue(name, value)
            onChange?.(value)
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
