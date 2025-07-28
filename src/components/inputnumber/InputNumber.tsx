import { InputNumber as FormikInputNumber, InputNumberProps } from 'formik-antd'
import cx from 'classnames'
import styles from './InputNumber.module.css'
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react'
type Props = Expand<InputNumberProps> & {
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
  ...props
}: Props) => {
  return (
    <FormikInputNumber
      name={name}
      max={max}
      min={min}
      step={step}
      className={cx(styles.j2InputNumber, props.className)}
      upHandler={<CaretUpIcon weight="bold" size={12} />}
      downHandler={<CaretDownIcon weight="bold" size={12} />}
      size={size}
      {...props}
    />
  )
}
