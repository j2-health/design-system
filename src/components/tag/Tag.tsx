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

type BaseProps = Expand<Omit<TagProps, 'icon' | 'color' | 'variant'>> & {
  status: 'default' | 'error' | 'success' | 'warning' | 'processing'
  /**
   * antd's `'outlined'`, `'filled'` and `'solid'`, plus `'tinted'`: a pale
   * fill, a mid border and dark text, all from `color` (or the status color).
   * For a set of tags told apart by color, such as user-defined labels on the
   * categorical palette.
   */
  variant?: TagProps['variant'] | 'tinted'
  /**
   * A color outside the status set, e.g. a data-visualization token
   * (`'var(--j2-color-interval-7-5)'`). Overrides the status color; use it
   * with `variant="solid"` for a filled badge, or `variant="tinted"` for a
   * pale one (`'var(--j2-color-categorical-3)'`).
   */
  color?: string
  /**
   * The border's color, when it should differ from the fill: e.g. a solid
   * badge with a darker edge (`'var(--j2-color-interval-7-7)'`).
   */
  borderColor?: string
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

/**
 * The tinted variant from one color: the fill at 14% over white, the border
 * at 45% over white, the text at 65% over black. On the categorical palette
 * the text clears 5.4:1 on its fill.
 */
export const tintedStyle = (hue: string): React.CSSProperties => ({
  background: `color-mix(in srgb, ${hue} 14%, white)`,
  borderColor: `color-mix(in srgb, ${hue} 45%, white)`,
  color: `color-mix(in srgb, ${hue} 65%, black)`,
})

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
  bordered,
  variant,
  color,
  borderColor,
  ...props
}: Props) => {
  const isSolid = variant === 'solid'
  const isTinted = variant === 'tinted'
  // antd derives a fill by parsing `color`, which a CSS variable or color-mix
  // doesn't survive, so the tinted colors are set as styles instead.
  const tint = isTinted ? tintedStyle(color ?? statusToColor[status]) : null
  // antd's solid "default" is near-black; the DS neutral is gray-11.
  const solidDefault =
    isSolid && !color && status === 'default' ? 'var(--j2-gray-11)' : undefined

  const iconComponent = React.useMemo(() => {
    if (!showIcon || size === 'small') return null

    const baseProps = {
      size: 12,
    }

    const iconName: Icon = icon ?? colorToIcon[status]
    // White on a solid fill, where the status color would vanish; the text
    // color on a tinted one.
    const iconColor: string = isSolid
      ? 'white'
      : (tint?.color ?? statusToColor[status])

    return (
      <span role="img" className="anticon" aria-label={`${status} icon`}>
        {React.createElement(iconName, { color: iconColor, ...baseProps })}
      </span>
    )
  }, [status, showIcon, icon, isSolid, tint?.color])

  const statusToClassName: Partial<Record<keyof typeof statusToColor, string>> =
    {
      default: 'bg-[var(--j2-color-fill-quaternary)]',
    }

  return (
    <AntdTag
      {...props}
      variant={
        isTinted
          ? 'outlined'
          : (variant ?? (bordered === false ? 'filled' : 'outlined'))
      }
      color={isTinted ? undefined : (color ?? solidDefault ?? status)}
      icon={iconComponent}
      style={
        tint || borderColor
          ? {
              ...tint,
              ...(borderColor ? { borderColor } : null),
              ...props.style,
            }
          : props.style
      }
      className={cx(
        'j2-tag',
        props.className,
        !isSolid && !isTinted && statusToClassName[status],
        isSolid && 'j2-tag-solid',
        isTinted && 'j2-tag-tinted',
        size === 'small' && '!px-1 !py-0 !h-auto !text-j2-xs !rounded-j2-sm'
      )}
    />
  )
}
