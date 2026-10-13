import { forwardRef } from 'react'
import cx from 'classnames'
import { ArrowDownIcon, ArrowUpIcon } from '@phosphor-icons/react'

import { Swatch, type SwatchVisualProps } from '../swatch'
import { mergeProps, useRender, type RenderProp } from '../../utils/useRender'

export type ChangeChipProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> & {
  /** A leading swatch, e.g. the kind of change. */
  swatch?: Omit<SwatchVisualProps, 'size'>
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
  /**
   * Replaces the button, e.g. `<span />` for a chip that opens nothing. The
   * hover and pointer apply only while the element is an enabled button. A
   * render function should spread its props: a wrapping `Popover` passes its
   * handlers through them.
   */
  render?: RenderProp<Record<string, never>>
}

/**
 * A compact chip for one change: an optional swatch, a label and a delta.
 * It is a button, so it can open a popover with the details; wrap it in a
 * `Popover` (it forwards its ref and handlers). Pass `render={<span />}` for
 * a chip that only displays. The ref is an `HTMLElement`, since `render` can
 * swap the button for another element.
 */
export const ChangeChip = forwardRef<HTMLElement, ChangeChipProps>(
  (
    { swatch, label, delta, placeholder, srLabel, className, render, ...props },
    ref
  ) => {
    const Arrow = delta?.direction === 'down' ? ArrowDownIcon : ArrowUpIcon
    return useRender({
      render,
      ref,
      state: {},
      defaultTagName: 'button',
      props: mergeProps(props, {
        className: cx(
          'inline-flex items-center gap-1 whitespace-nowrap rounded-j2-sm border border-j2-border bg-[var(--j2-color-fill-quaternary)] px-2 py-px text-xs text-j2-text transition-colors enabled:cursor-pointer enabled:hover:bg-j2-gray-2',
          className
        ),
        children: (
          <>
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
          </>
        ),
      }),
    })
  }
)
ChangeChip.displayName = 'ChangeChip'
