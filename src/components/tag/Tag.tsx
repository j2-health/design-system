import * as React from 'react'
import { Tag as AntdTag, TagProps } from 'antd'
import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  GearIcon,
  Icon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import cx from 'classnames'
import './Tag.css'

type BaseProps = Expand<Omit<TagProps, 'icon'>> & {
  status: 'default' | 'error' | 'success' | 'warning' | 'processing'
}

type DefaultSizeProps = BaseProps & {
  size?: 'default'
  icon?: Icon
  showIcon?: boolean
}

type SmallSizeProps = BaseProps & {
  size: 'small'
  /** Icons are not supported on the small variant — omit this prop. */
  icon?: never
  showIcon?: never
}

type Props = DefaultSizeProps | SmallSizeProps

const colorToIcon = {
  error: XCircleIcon,
  success: CheckCircleIcon,
  warning: WarningCircleIcon,
  processing: ArrowsClockwiseIcon,
  default: GearIcon,
}

const statusToColor = {
  error: 'var(--j2-color-error-text)',
  success: 'var(--j2-color-success)',
  warning: 'var(--j2-color-warning-text)',
  processing: 'var(--j2-color-primary)',
  default: 'var(--j2-color-text)',
}

export const Tag = ({
  status,
  showIcon = false,
  icon,
  size = 'default',
  ...props
}: Props) => {
  const iconComponent = React.useMemo(() => {
    if (!showIcon || size === 'small') return null

    const baseProps = {
      size: 12,
    }

    const iconName: Icon = icon ?? colorToIcon[status]
    const color: string = statusToColor[status]

    return (
      <span role="img" className="anticon" aria-label={`${status} icon`}>
        {React.createElement(iconName, { color, ...baseProps })}
      </span>
    )
  }, [status, showIcon, icon])

  const statusToClassName: Partial<Record<keyof typeof statusToColor, string>> =
    {
      default: 'bg-[var(--j2-color-fill-quaternary)]',
    }

  return (
    <AntdTag
      {...props}
      color={status}
      icon={iconComponent}
      className={cx(
        props.className,
        statusToClassName[status],
        size === 'small' && '!px-1 !py-0 !h-auto !text-j2-xs !rounded-j2-sm'
      )}
    />
  )
}
