import cx from 'classnames'

export type SwatchProps = {
  /** Any CSS color, e.g. `'var(--j2-color-interval-7-7)'`. */
  color?: string
  /**
   * - `'solid'`: filled with `color`.
   * - `'hatched'`: a light fill, a `color` border and a diagonal stroke. For
   *   a softer version of the same meaning as solid.
   * - `'outline'`: an empty square with a neutral border. For "none".
   */
  variant?: 'solid' | 'hatched' | 'outline'
  /** The hatched variant's light fill. Defaults to `color` at 10%. */
  tint?: string
  /** The hatched variant's stroke. Defaults to `color`. */
  stroke?: string
  /** Side in px. */
  size?: number
  /** Corner radius in px. */
  radius?: number
  className?: string
}

/**
 * A small color square for keys, legends and inline indicators.
 */
export const Swatch = ({
  color = 'var(--j2-color-primary)',
  variant = 'solid',
  tint,
  stroke,
  size = 16,
  radius = 4,
  className,
}: SwatchProps) => {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
  }

  if (variant === 'solid') {
    return (
      <span
        className={cx('block shrink-0', className)}
        style={{ ...style, background: color }}
      />
    )
  }

  if (variant === 'hatched') {
    return (
      <span
        className={cx('block shrink-0 overflow-hidden border', className)}
        style={{
          ...style,
          borderColor: color,
          background: tint ?? `color-mix(in srgb, ${color} 10%, white)`,
        }}
      >
        <svg viewBox="0 0 16 16" className="block h-full w-full">
          <line
            x1="0"
            y1="16"
            x2="16"
            y2="0"
            stroke={stroke ?? color}
            strokeWidth="1.5"
          />
        </svg>
      </span>
    )
  }

  return (
    <span
      className={cx(
        'block shrink-0 border border-j2-border bg-white',
        className
      )}
      style={style}
    />
  )
}
