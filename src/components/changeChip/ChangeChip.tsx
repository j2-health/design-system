import { forwardRef } from 'react'
import cx from 'classnames'
import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react'

import { Swatch, type SwatchProps } from '../swatch'

export type ChangeChipProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> & {
  /** A leading swatch, e.g. the kind of change. */
  swatch?: Omit<SwatchProps, 'size'>
  /** What changed, e.g. an area's name. */
  label?: React.ReactNode
  /** How much it changed. */
  delta?: {
    direction: 'up' | 'down'
    value: React.ReactNode
    /** Text color for the arrow and value. Defaults to the primary color. */
    color?: string
  }
  /** Trailing text when there is no delta to show, e.g. an em dash. */
  placeholder?: React.ReactNode
  /** A full description for assistive tech, when the visible text is terse. */
  srLabel?: string
}

/**
 * A compact chip for one change: an optional swatch, a label and a delta.
 * It is a button, so it can open a popover with the details; wrap it in a
 * `Popover` (it forwards its ref and handlers).
 */
export const ChangeChip = forwardRef<HTMLButtonElement, ChangeChipProps>(
  (
    { swatch, label, delta, placeholder, srLabel, className, ...props },
    ref
  ) => {
    const Arrow = delta?.direction === 'down' ? ArrowDownIcon : ArrowUpIcon
    return (
      <button
        {...props}
        ref={ref}
        type="button"
        className={cx(
          'inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-j2-sm border border-j2-border bg-[var(--j2-color-fill-quaternary)] px-2 py-px text-xs text-j2-text transition-colors hover:bg-j2-gray-2',
          className
        )}
      >
        {swatch && <Swatch {...swatch} size={12} />}
        {label && <span>{label}</span>}
        {delta && (
          <span
            className="inline-flex items-center gap-0.5 font-medium"
            style={{ color: delta.color ?? 'var(--j2-color-primary)' }}
          >
            <Arrow size={11} weight="bold" aria-hidden />
            {delta.value}
          </span>
        )}
        {!delta && placeholder && (
          <span className="text-j2-text-secondary">{placeholder}</span>
        )}
        {srLabel && <span className="sr-only">{srLabel}</span>}
      </button>
    )
  }
)
ChangeChip.displayName = 'ChangeChip'
