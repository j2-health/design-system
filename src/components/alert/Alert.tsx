import * as React from 'react'
import { Alert as AntdAlert, AlertProps } from 'antd'
import {
  CheckCircle,
  Info,
  WarningCircle,
  X,
  XCircle,
} from '@phosphor-icons/react'
type Props = Expand<AlertProps> & {
  description?: string
  type: 'success' | 'info' | 'warning' | 'error'
  closable?: boolean
  showIcon?: boolean
  banner?: boolean
}

const Alert = ({
  description,
  type,
  closable = true,
  showIcon = true,
  banner = true,
  ...props
}: Props) => {
  const icon = React.useMemo(() => {
    const size = description ? 24 : 16

    switch (type) {
      case 'success':
        return <CheckCircle fill="var(--j2-color-success-text)" size={size} />
      case 'error':
        return <XCircle fill="var(--j2-color-error-text)" size={size} />
      case 'info':
        return <Info fill="var(--j2-color-info-text)" size={size} />
      case 'warning':
        return <WarningCircle fill="var(--j2-color-warning-text)" size={size} />
      default:
        return null
    }
  }, [type, description])

  return (
    <AntdAlert
      icon={icon}
      closable={closable}
      showIcon={showIcon}
      type={type}
      banner={banner}
      description={description}
      closeIcon={<X size={14} weight="regular" />}
      {...props}
    />
  )
}

export { Alert }
