import { Progress as AntdProgress, ProgressProps } from 'antd'

const Progress = ({ ...props }: ProgressProps) => {
  return <AntdProgress {...props} />
}

export { Progress }
