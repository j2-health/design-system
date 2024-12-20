import { InputNumber as FormikInputNumber, InputNumberProps } from 'formik-antd'
import cx from 'classnames'
import './InputNumber.css'
import { CaretDown, CaretUp } from '@phosphor-icons/react'
type Props = Expand<InputNumberProps> & {
  name: string
}

export const InputNumber = ({ size = 'large', name, ...props }: Props) => {
  return (
    <FormikInputNumber
      name={name}
      className={cx('j2-input-number', props.className)}
      upHandler={<CaretUp weight="bold" size={12} />}
      downHandler={<CaretDown weight="bold" size={12} />}
      size={size}
      {...props}
    />
  )
}
