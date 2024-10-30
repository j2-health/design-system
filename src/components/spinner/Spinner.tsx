import { Spin } from 'antd'
import Icon from '@ant-design/icons'

import ProgressCircle from '../../svgs/ProgressCircle.svg?react'

type SpinnerProps = {
  size?: number
}

const SpinIcon = ({ height, width }: { height?: number; width?: number }) => {
  return (
    <Icon spin component={() => <ProgressCircle />} style={{ height, width }} />
  )
}

export const Spinner = ({ size = 80 }: SpinnerProps) => {
  return <Spin indicator={<SpinIcon height={size} width={size} />} />
}
