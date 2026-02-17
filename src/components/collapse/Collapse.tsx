import * as React from 'react'
import { Collapse as AntdCollapse, CollapseProps } from 'antd'
import {
  CaretDownIcon,
  InfoIcon,
  WarningCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import styles from './Collapse.module.css'

export type CollapseState = 'default' | 'warning' | 'error'

export type Props = Expand<CollapseProps> & {
  state?: CollapseState
  showIcon?: boolean
}

const stateConfig: Record<
  CollapseState,
  { className: string; Icon: React.ElementType; color: string }
> = {
  default: {
    className: styles.default,
    Icon: InfoIcon,
    color: 'var(--j2-color-text)',
  },
  warning: {
    className: styles.warning,
    Icon: WarningCircleIcon,
    color: 'var(--j2-color-warning-text)',
  },
  error: {
    className: styles.error,
    Icon: XCircleIcon,
    color: 'var(--j2-color-error-text)',
  },
}

const Collapse = ({
  state = 'default',
  showIcon = false,
  className,
  items,
  ...props
}: Props) => {
  const { className: stateClass, Icon, color } = stateConfig[state]

  const icon = React.useMemo(() => {
    if (!showIcon) return null
    return <Icon size={14} fill={color} style={{ flexShrink: 0 }} />
  }, [state, showIcon])

  const itemsWithIcon = React.useMemo(() => {
    if (!icon || !items) return items
    return (items as NonNullable<CollapseProps['items']>).map((item) => ({
      ...item,
      label: (
        <>
          {icon}
          {item.label}
        </>
      ),
    }))
  }, [items, icon])

  return (
    <AntdCollapse
      {...props}
      items={itemsWithIcon}
      className={[stateClass, className].filter(Boolean).join(' ')}
      expandIcon={({ isActive }) => (
        <CaretDownIcon
          size={14}
          style={{ transform: `rotate(${isActive ? 0 : -90}deg)` }}
        />
      )}
    />
  )
}

export { Collapse }
