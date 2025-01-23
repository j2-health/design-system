import { Spin } from 'antd'
import Icon from '@ant-design/icons'

import ProgressCircle from '../../svgs/ProgressCircle.svg?react'

type SpinnerProps = {
  size?: number
  className?: string
}

const SpinIcon = ({ height, width }: { height?: number; width?: number }) => {
  return (
    <Icon spin component={() => <ProgressCircle />} style={{ height, width }} />
  )
}

export const Spinner = ({ size = 80, className }: SpinnerProps) => {
  return (
    <Spin
      className={className}
      indicator={<SpinIcon height={size} width={size} />}
    />
  )
}
