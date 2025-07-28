import { StarIcon } from '@phosphor-icons/react'
import { Rate as AntdRate, RateProps } from 'antd'
import './Rate.css'

export type Props = Expand<RateProps>

export const Rate = ({ count = 5, ...props }: Props) => {
  return (
    <AntdRate
      {...props}
      className="j2-rate"
      count={count}
      disabled={true}
      allowHalf={true}
      allowClear={true}
      character={<StarIcon weight="fill" />}
    />
  )
}
