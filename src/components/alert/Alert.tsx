import * as React from 'react'
import { Alert as AntdAlert, AlertProps } from 'antd'
import {
  CheckCircle,
  Info,
  WarningCircle,
  XCircle,
} from '@phosphor-icons/react'
type Props = Expand<AlertProps>

const Alert = (props: Props) => {
  const icon = React.useMemo(() => {
    switch (props.type) {
      case 'success':
        return <CheckCircle fill="var(--j2-color-success-text)" />
      case 'error':
        return <XCircle fill="var(--j2-color-error-text)" />
      case 'info':
        return <Info fill="var(--j2-color-info-text)" />
      case 'warning':
        return <WarningCircle fill="var(--j2-color-warning-text)" />
      default:
        return null
    }
  }, [props.type])

  return <AntdAlert {...props} icon={icon} />
}

export { Alert }
