import { Alert as AntdAlert, AlertProps } from 'antd'

type Props = Expand<AlertProps>

const Alert = (props: Props) => {
  return <AntdAlert {...props} />
}

export { Alert }
