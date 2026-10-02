import cx from 'classnames'
import { CaretDownIcon } from '@phosphor-icons/react'

import styles from './ThresholdBar.module.css'

export type ThresholdBarProps = {
  /** The solid segment's extent, 0–100. */
  value: number
  /**
   * The striped "potential" segment's extent, 0–100. It sits under the solid
   * one, so it shows only where it reaches past `value`.
   */
  projected?: number
  /** Fill for the solid segment and the marker. */
  color?: string
  /** The striped segment's two colors: background and stripe. */
  stripeColors?: { fill: string; stripe: string }
  /** A caret above the bar, with a label, at a point of interest. */
  marker?: {
    value: number
    label: React.ReactNode
    detail?: React.ReactNode
    color?: string
  }
  /** A dashed line through the bar, with a caption under it. */
  threshold?: { value: number; label: React.ReactNode }
  /** The bar's accessible description. */
  ariaLabel: string
  className?: string
}

const clamp = (value: number) => Math.max(0, Math.min(100, value))

const CARET = 14

/** Keep a label inside the bar's width near either end. */
const labelAlign = (position: number, buffer: number) => {
  if (position <= buffer) {
    return { transform: 'translateX(0%)', textAlign: 'left' as const }
  }
  if (position >= 100 - buffer) {
    return { transform: 'translateX(-100%)', textAlign: 'right' as const }
  }
  return { transform: 'translateX(-50%)', textAlign: 'center' as const }
}

/**
 * A 0–100 bar showing a current value, an optional projected value as
 * animated stripes, a marker at a point of interest and a threshold line.
 */
export const ThresholdBar = ({
  value,
  projected,
  color = 'var(--j2-color-primary)',
  stripeColors,
  marker,
  threshold,
  ariaLabel,
  className,
}: ThresholdBarProps) => {
  const solid = clamp(value)
  const striped = projected === undefined ? undefined : clamp(projected)
  const markerAt = marker && clamp(marker.value)
  const markerColor = marker?.color ?? color
  const thresholdAt = threshold && clamp(threshold.value)

  return (
    <div className={cx('flex flex-col', className)}>
      {marker && markerAt !== undefined && (
        <div className="relative" style={{ height: 40 }}>
          <div
            aria-hidden
            className={cx('absolute bottom-0', styles.move)}
            style={{
              left: `clamp(${CARET / 2}px, ${markerAt}%, calc(100% - ${CARET / 2}px))`,
              transform: 'translateX(-50%)',
              color: markerColor,
            }}
          >
            <CaretDownIcon size={CARET} weight="fill" />
          </div>
          <div
            className={cx(
              'absolute flex flex-col whitespace-nowrap',
              styles.move
            )}
            style={{
              bottom: CARET,
              left: `${markerAt}%`,
              color: markerColor,
              ...labelAlign(markerAt, 20),
            }}
          >
            <span className="mb-0.5 text-j2-xs font-semibold leading-none">
              {marker.label}
            </span>
            {marker.detail && (
              <span className="text-j2-xs font-semibold leading-none">
                {marker.detail}
              </span>
            )}
          </div>
        </div>
      )}
      <div
        role="img"
        aria-label={ariaLabel}
        className="relative w-full overflow-hidden rounded-j2-sm border border-j2-border-secondary bg-j2-gray-2"
        style={{ height: 14 }}
      >
        {striped !== undefined && (
          <div
            className={cx(
              'absolute inset-y-0 left-0',
              styles.stripes,
              styles.move
            )}
            style={
              {
                width: `${striped}%`,
                '--j2-stripes-fill':
                  stripeColors?.fill ??
                  `color-mix(in srgb, ${color} 14%, white)`,
                '--j2-stripes-stripe':
                  stripeColors?.stripe ??
                  `color-mix(in srgb, ${color} 30%, white)`,
              } as React.CSSProperties
            }
          />
        )}
        <div
          className={cx('absolute inset-y-0 left-0', styles.move)}
          style={{ width: `${solid}%`, backgroundColor: color }}
        />
        {thresholdAt !== undefined && (
          <>
            <div
              className="pointer-events-none absolute inset-y-0 bg-white"
              style={{
                left: `${thresholdAt}%`,
                transform: 'translateX(-50%)',
                width: 4,
                opacity: 0.85,
              }}
            />
            <div
              className="pointer-events-none absolute inset-y-0"
              style={{
                left: `${thresholdAt}%`,
                borderLeft: '1.5px dashed var(--j2-color-text)',
                transform: 'translateX(-0.75px)',
              }}
            />
          </>
        )}
      </div>
      {threshold && thresholdAt !== undefined && (
        <div className="relative mt-1" style={{ height: 20 }}>
          <div
            className={cx(
              'j2-caption-xs absolute whitespace-nowrap',
              styles.move
            )}
            style={{ left: `${thresholdAt}%`, ...labelAlign(thresholdAt, 10) }}
          >
            {threshold.label}
          </div>
        </div>
      )}
    </div>
  )
}
