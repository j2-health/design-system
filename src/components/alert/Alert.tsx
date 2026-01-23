import * as React from 'react'
import { Alert as AntdAlert, AlertProps, theme } from 'antd'
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XIcon,
  XCircleIcon,
  CircleNotchIcon,
} from '@phosphor-icons/react'
import styles from './Alert.module.css'
type Props = Expand<Omit<AlertProps, 'type'>> & {
  description?: string
  type: 'success' | 'info' | 'warning' | 'error' | 'loading'
  closable?: boolean
  showIcon?: boolean
  banner?: boolean
}

const Alert = ({
  description,
  type,
  closable = false,
  showIcon = true,
  banner = false,
  ...props
}: Props) => {
  const { token } = theme.useToken()
  const icon = React.useMemo(() => {
    const size = description ? token.sizeLG : token.size
    const iconStyle = !description
      ? { display: 'flex', alignItems: 'center' }
      : undefined

    const iconElement = (() => {
      switch (type) {
        case 'success':
          return (
            <CheckCircleIcon fill="var(--j2-color-success-text)" size={size} />
          )
        case 'error':
          return <XCircleIcon fill="var(--j2-color-error-text)" size={size} />
        case 'info':
          return <InfoIcon fill="var(--j2-color-info-text)" size={size} />
        case 'warning':
          return (
            <WarningCircleIcon
              fill="var(--j2-color-warning-text)"
              size={size}
            />
          )
        case 'loading':
          return (
            <CircleNotchIcon
              fill="var(--j2-color-info-text)"
              size={size}
              weight="regular"
              style={{
                animation: 'spin 1s linear infinite',
              }}
            />
          )
        default:
          return null
      }
    })()

    return iconStyle ? (
      <span style={iconStyle}>{iconElement}</span>
    ) : (
      iconElement
    )
  }, [type, description, token.size, token.sizeLG])

  const antDType = React.useMemo(():
    | 'success'
    | 'info'
    | 'warning'
    | 'error' => {
    switch (type) {
      case 'loading':
        return 'info'
      default:
        return type as 'success' | 'info' | 'warning' | 'error'
    }
  }, [type])

  return (
    <AntdAlert
      className={styles.alert}
      icon={icon}
      closable={closable}
      showIcon={showIcon}
      type={antDType}
      banner={banner}
      description={description}
      closeIcon={<XIcon size={token.size} weight="regular" />}
      {...props}
    />
  )
}

export { Alert }
