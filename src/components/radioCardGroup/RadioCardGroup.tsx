import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import cx from 'classnames'

export type RadioCardOption<T extends string> = {
  value: T
  label: ReactNode
  /** One short line under the label. Leave it out when the label says
   *  enough. */
  description?: ReactNode
  disabled?: boolean
}

export type RadioCardGroupProps<T extends string> = {
  options: RadioCardOption<T>[]
  value?: T | null
  onChange: (value: T) => void
  /** Cards per row; defaults to one row with every option. */
  columns?: number
  'aria-label'?: string
  'aria-labelledby'?: string
  className?: string
}

/**
 * A single choice shown as a row of bordered cards, each with a radio mark,
 * a label and an optional line of description. Behaves as a radio group: the
 * arrow keys move between cards and select, and only the selected card (or
 * the first, when none is) is in the tab order.
 */
export function RadioCardGroup<T extends string>({
  options,
  value,
  onChange,
  columns,
  className,
  ...aria
}: RadioCardGroupProps<T>) {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const enabled = options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => !option.disabled)
  const selectedIndex = options.findIndex((option) => option.value === value)
  const tabStop =
    selectedIndex >= 0 && !options[selectedIndex].disabled
      ? selectedIndex
      : (enabled[0]?.index ?? -1)

  const move = (from: number, step: 1 | -1) => {
    const position = enabled.findIndex(({ index }) => index === from)
    const next = enabled[(position + step + enabled.length) % enabled.length]
    if (!next) return
    onChange(next.option.value)
    refs.current[next.index]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      move(index, 1)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      move(index, -1)
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      onChange(options[index].value)
    }
  }

  return (
    <div
      role="radiogroup"
      {...aria}
      className={cx('grid gap-3', className)}
      style={{
        gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))`,
      }}
    >
      {options.map((option, index) => {
        const selected = option.value === value
        return (
          <div
            key={option.value}
            ref={(element) => {
              refs.current[index] = element
            }}
            role="radio"
            aria-checked={selected}
            aria-disabled={option.disabled || undefined}
            tabIndex={index === tabStop ? 0 : -1}
            onClick={() => !option.disabled && onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cx(
              'rounded-j2 border-2 border-solid p-3.5 transition-colors',
              option.disabled
                ? 'cursor-not-allowed border-j2-gray-5 opacity-60'
                : selected
                  ? 'cursor-pointer border-j2-primary bg-j2-blue-1'
                  : 'cursor-pointer border-j2-gray-5 hover:border-j2-gray-7 hover:bg-j2-gray-1'
            )}
          >
            <div
              className={cx(
                'flex items-center gap-2.5',
                Boolean(option.description) && 'mb-1'
              )}
            >
              <span
                aria-hidden
                className={cx(
                  'flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 border-solid transition-colors',
                  selected ? 'border-j2-primary' : 'border-j2-gray-7'
                )}
              >
                <span
                  className={cx(
                    'h-[9px] w-[9px] rounded-full transition-colors',
                    selected ? 'bg-j2-primary' : 'bg-transparent'
                  )}
                />
              </span>
              <span className="text-sm font-semibold text-j2-text">
                {option.label}
              </span>
            </div>
            {option.description && (
              <div className="pl-7 text-xs leading-snug text-j2-text-secondary">
                {option.description}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
