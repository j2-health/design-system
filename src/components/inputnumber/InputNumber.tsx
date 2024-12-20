import { InputNumber as AntdInputNumber, InputNumberProps } from 'antd'
import cx from 'classnames'
import './InputNumber.css'
import { CaretDown, CaretUp } from '@phosphor-icons/react'
type Props = Expand<InputNumberProps>

export const InputNumber = ({ size = 'large', ...props }: Props) => {
  return (
    <AntdInputNumber
      className={cx('j2-input-number', props.className)}
      upHandler={<CaretUp weight="bold" size={12} />}
      downHandler={<CaretDown weight="bold" size={12} />}
      size={size}
      {...props}
    />
  )
}
