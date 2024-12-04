import * as React from 'react'
import { Tag as AntdTag, TagProps } from 'antd'
import {
  ArrowsClockwise,
  CheckCircle,
  Gear,
  Icon,
  WarningCircle,
  XCircle,
} from '@phosphor-icons/react'
import './Tag.css'

type Props = Expand<Omit<TagProps, 'icon'>> & {
  status: 'default' | 'error' | 'success' | 'warning' | 'processing'
  icon?: Icon
  showIcon?: boolean
}

const colorToIcon = {
  error: XCircle,
  success: CheckCircle,
  warning: WarningCircle,
  processing: ArrowsClockwise,
  default: Gear,
}

const statusToColor = {
  error: 'var(--j2-color-error-text)',
  success: 'var(--j2-color-success)',
  warning: 'var(--j2-color-warning-text)',
  processing: 'var(--j2-color-primary)',
  default: 'var(--j2-color-text)',
}

export const Tag = ({ status, showIcon = false, icon, ...props }: Props) => {
  const iconComponent = React.useMemo(() => {
    if (!showIcon) return null

    const baseProps = {
      className: 'j2-tag-icon',
      size: 12,
    }

    const iconName: Icon = icon ?? colorToIcon[status]
    const color: string = statusToColor[status]

    return React.createElement(iconName, { color, ...baseProps })
  }, [status, showIcon, icon])

  return (
    <AntdTag
      {...props}
      color={status}
      icon={iconComponent}
      className="j2-tag"
    />
  )
}
