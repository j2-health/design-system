import cx from 'classnames'

import { Checkbox } from '../checkbox'
import { Radio } from '../radio'

export type ListRowProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onClick'
> & {
  /** The row is part of the current selection. */
  selected?: boolean
  /**
   * The row carries a change that has not been applied yet. Wins over
   * `selected`, so a pending row reads the same whether or not it is selected.
   */
  pending?: boolean
  /**
   * Light the row as if hovered. For hover driven from elsewhere, e.g. the
   * matching marker on a map; the row's own `:hover` works without it.
   */
  highlighted?: boolean
  /** Makes the row a button: focusable, and Enter or Space activates it. */
  onClick?: () => void
  /** Called with `true` on pointer enter and `false` on leave. */
  onHoverChange?: (hovered: boolean) => void
  /**
   * A leading control bound to `selected`: `'checkbox'` for picking several
   * rows, `'radio'` for picking one. Using it doesn't trigger `onClick`, so a
   * row can open a record and be selected separately.
   */
  selection?: 'checkbox' | 'radio'
  /** Called when the selection control changes. */
  onSelectedChange?: (selected: boolean) => void
  /** Accessible name for the selection control, e.g. the row's title. */
  selectionLabel?: string
}

/**
 * A row in a list of records, with hover, selected and pending states.
 * Precedence: pending, then selected, then hover. A selected row keeps its
 * own fill under the cursor rather than stacking a hover tint on top.
 */
export const ListRow = ({
  selected = false,
  pending = false,
  highlighted = false,
  onClick,
  onHoverChange,
  selection,
  onSelectedChange,
  selectionLabel,
  className,
  children,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ListRowProps) => {
  const resting = !pending && !selected

  return (
    <div
      {...props}
      data-selected={selected || undefined}
      data-pending={pending || undefined}
      role={onClick ? 'button' : props.role}
      tabIndex={onClick ? 0 : props.tabIndex}
      aria-pressed={onClick && !selection ? selected : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (!onClick || event.defaultPrevented) return
        if (event.target !== event.currentTarget) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      onMouseEnter={(event) => {
        onMouseEnter?.(event)
        onHoverChange?.(true)
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event)
        onHoverChange?.(false)
      }}
      className={cx(
        'border-b border-j2-gray-3 px-4 py-3 transition-colors',
        onClick && 'cursor-pointer',
        pending && 'bg-[var(--j2-color-warning-bg)]',
        !pending && selected && 'bg-[var(--j2-color-primary-bg-hover)]',
        resting && (highlighted ? 'bg-j2-gray-3' : 'hover:bg-j2-gray-3'),
        className
      )}
    >
      {selection ? (
        <div className="flex items-start gap-2">
          <span
            className="flex shrink-0 pt-0.5"
            onClick={(event) => event.stopPropagation()}
          >
            {selection === 'checkbox' ? (
              <Checkbox
                checked={selected}
                aria-label={selectionLabel}
                onChange={(event) => onSelectedChange?.(event.target.checked)}
              />
            ) : (
              <Radio
                checked={selected}
                aria-label={selectionLabel}
                onChange={() => onSelectedChange?.(true)}
              />
            )}
          </span>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
