export type CircularProgressProps = {
  /** Progress percentage value (0-100) */
  percent: number
  /** Size of the component in pixels */
  size?: number
  /** Width of the ring stroke in pixels */
  strokeWidth?: number
  /** Tailwind classes for the ring (background circle) - use text-* for color */
  ringClassName?: string
  /** Tailwind classes for the track (progress arc) - use text-* for color */
  trackClassName?: string
  /** Tailwind classes for the center fill - use text-* for color */
  centerClassName?: string
  /** Whether to show the percentage value inside the ring */
  showPercent?: boolean
  /** Tailwind classes for the percentage text */
  textClassName?: string
  /** Additional classes for the root element */
  className?: string
}

export const CircularProgress = ({
  percent,
  size = 64,
  strokeWidth = 6,
  ringClassName = 'text-j2-gray-4',
  trackClassName = 'text-j2-primary',
  centerClassName,
  showPercent = false,
  textClassName = 'text-j2-primary',
  className,
}: CircularProgressProps) => {
  const clampedPercent = Math.min(100, Math.max(0, percent))

  // Fixed viewBox for consistent rendering at any size
  const viewBox = 100
  const strokeInViewBoxUnits = (strokeWidth / size) * viewBox

  const radius = (viewBox - strokeInViewBoxUnits) / 2

  const circumference = 2 * Math.PI * radius

  const arcProp = {
    strokeDasharray: circumference,
    strokeDashoffset: circumference * (1 - clampedPercent / 100),
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      className={className}
      shapeRendering="geometricPrecision"
      aria-valuenow={clampedPercent}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    >
      {/* Center fill (optional) */}
      {centerClassName && (
        <circle
          cx="50%"
          cy="50%"
          r={radius - strokeInViewBoxUnits / 2}
          className={centerClassName}
          fill="currentColor"
        />
      )}

      {/* Background ring - full circle (bottom layer) */}
      <circle
        cx="50%"
        cy="50%"
        r={radius}
        fill="none"
        strokeWidth={strokeInViewBoxUnits}
        stroke="currentColor"
        className={ringClassName}
      />

      {/* Progress track - arc showing filled portion (top layer) */}
      <circle
        cx="50%"
        cy="50%"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeInViewBoxUnits}
        strokeLinecap="round"
        {...(clampedPercent < 100 && arcProp)}
        transform="rotate(-90 50 50)"
        style={{ shapeRendering: 'geometricPrecision' }}
        className={trackClassName}
      />

      {/* Percentage text */}
      {showPercent && (
        <text
          x="50%"
          y="50%"
          fontSize="1.5em"
          fontWeight={500}
          fill="currentColor"
          textAnchor="middle"
          dy="0.35em"
          className={textClassName}
        >
          {Math.round(clampedPercent)}%
        </text>
      )}
    </svg>
  )
}
