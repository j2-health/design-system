import {
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { CheckIcon } from '@phosphor-icons/react'
import cx from 'classnames'
import { Button } from '../button'
import { Popover, type PopoverProps } from '../popover'
import { Swatch } from '../swatch'

export type SwatchPickerColor = {
  /** What `onChange` reports: a token name, a hex, any id. */
  value: string
  /** Any CSS color. Defaults to `value`. */
  color?: string
  /** The swatch's accessible name. Defaults to `value`. */
  label?: string
}

export type SwatchPickerProps = {
  /** The colors offered, in order. */
  colors: SwatchPickerColor[]
  /** The current color's `value`. */
  value: string
  /** What is being colored, for the grid's name: "Color for {label}". */
  label: string
  onChange: (value: string) => void
  /** The starting color. "Reset to default" shows once `value` differs from it. */
  defaultValue?: string
  /**
   * - `'popover'`: the grid opens from `children` and closes on a pick.
   * - `'inline'`: the grid in place, with no control or popover, and smaller
   *   swatches (20px, against 24px in the popover).
   */
  variant?: 'popover' | 'inline'
  /** The control that opens the popover. Not used inline. */
  children?: ReactNode
  /** The popover's placement. */
  placement?: PopoverProps['placement']
  /** Where the popover renders. Defaults to the enclosing modal, or the page when there is none. */
  getPopupContainer?: PopoverProps['getPopupContainer']
  /**
   * Called when the popover opens or closes, e.g. to keep a panel around it
   * open meanwhile. Not used inline.
   */
  onOpenChange?: (open: boolean) => void
}

const COLUMNS = 8

// The maps picker's corners (2px); Swatch's default is 4px.
const RADIUS = 2

// Centers the check on its swatch.
const CENTERED = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const

// Arrow keys move through the grid; each is the step in swatches.
const STEPS: Record<string, number> = {
  ArrowRight: 1,
  ArrowLeft: -1,
  ArrowDown: COLUMNS,
  ArrowUp: -COLUMNS,
}

// Inside a modal the popover renders in the modal's container. A popover on
// the page body can't take focus, since the modal pulls it back, and the
// modal's outer box ignores the pointer, so only its container takes clicks.
const modalOrPage = (trigger: HTMLElement) =>
  trigger.closest<HTMLElement>('.ant-modal-container') ?? document.body

// The first three channels of a painted color, 0 to 255. Browsers report
// `rgb(…)` for most colors and `color(srgb …)`, 0 to 1, for color-mix results.
const channels = (painted: string) => {
  const numbers = painted.match(/[\d.]+/g)?.map(Number)
  if (!numbers || numbers.length < 3) return null
  const scale = painted.startsWith('color(') ? 255 : 1
  return numbers.slice(0, 3).map((n) => n * scale)
}

// Whether a swatch needs a light check mark: Rec. 601 luma, which is enough
// for a light-or-dark decision.
const isDark = (painted: string) => {
  const rgb = channels(painted)
  return rgb ? (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 < 140 : true
}

// Colors may be CSS variables, so the check reads its swatch as painted.
const Check = () => {
  const ref = useRef<HTMLSpanElement>(null)
  const [dark, setDark] = useState(true)
  useLayoutEffect(() => {
    const swatch = ref.current?.parentElement
    if (swatch) setDark(isDark(getComputedStyle(swatch).backgroundColor))
  }, [])
  return (
    <span ref={ref} className="flex">
      <CheckIcon
        size={12}
        weight="bold"
        color="currentColor"
        className={cx('block', dark ? 'text-white' : 'text-j2-text')}
      />
    </span>
  )
}

// The grid and its Reset link. Focus rests on one swatch at a time (roving
// tabindex), so the grid is one Tab stop and the arrow keys move within it;
// Enter or Space picks. It starts on the current color, or the first when
// that isn't in the grid.
const SwatchGrid = ({
  colors,
  value,
  defaultValue,
  label,
  onPick,
  gridRef,
  size,
}: {
  colors: SwatchPickerColor[]
  value: string
  defaultValue?: string
  label: string
  onPick: (value: string) => void
  gridRef?: RefObject<HTMLDivElement | null>
  /** Swatch side in px. */
  size: number
}) => {
  const [focusIndex, setFocusIndex] = useState(() =>
    Math.max(
      0,
      colors.findIndex((c) => c.value === value)
    )
  )
  const swatches = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent) => {
    const step = STEPS[event.key]
    if (step === undefined) return
    event.preventDefault()
    const next = focusIndex + step
    if (next < 0 || next >= colors.length) return
    setFocusIndex(next)
    swatches.current[next]?.focus()
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={gridRef}
        role="radiogroup"
        aria-label={`Color for ${label}`}
        className="grid grid-cols-8 gap-1"
        onKeyDown={onKeyDown}
      >
        {colors.map((c, index) => {
          const selected = c.value === value
          return (
            <button
              key={c.value}
              ref={(node) => {
                swatches.current[index] = node
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={c.label ?? c.value}
              tabIndex={index === focusIndex ? 0 : -1}
              onClick={() => {
                // Inline the grid stays, so arrow keys go on from the pick.
                setFocusIndex(index)
                onPick(c.value)
              }}
              className="flex cursor-pointer rounded-j2-xs border-0 bg-transparent p-0"
            >
              <Swatch
                color={c.color ?? c.value}
                size={size}
                radius={RADIUS}
                style={CENTERED}
              >
                {selected && <Check />}
              </Swatch>
            </button>
          )
        })}
      </div>
      {/* Only offered when it would change something. */}
      {defaultValue !== undefined && value !== defaultValue && (
        <Button
          type="link"
          size="small"
          className="self-start !px-0"
          onClick={() => onPick(defaultValue)}
        >
          Reset to default
        </Button>
      )}
    </div>
  )
}

/**
 * Pick one color from a fixed set, in a popover or inline. A grid rather than
 * a free color input, so two items can't end up on colors that are hard to
 * tell apart. The popover opens on the current color and closes on a pick.
 */
export const SwatchPicker = ({
  colors,
  value,
  label,
  onChange,
  defaultValue,
  variant = 'popover',
  children,
  placement = 'rightTop',
  getPopupContainer = modalOrPage,
  onOpenChange,
}: SwatchPickerProps) => {
  const [open, setOpenState] = useState(false)
  const setOpen = (next: boolean) => {
    setOpenState(next)
    onOpenChange?.(next)
  }
  const gridRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  // Focus moves into the grid on open, onto the swatch that is its Tab stop:
  // a frame later, once the popover is in the page. (afterOpenChange waits
  // for the open animation.)
  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() =>
      gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
    )
    return () => cancelAnimationFrame(frame)
  }, [open])

  // A pick or Escape closes it and returns focus to the control that opened it.
  const close = () => {
    setOpen(false)
    triggerRef.current
      ?.querySelector<HTMLElement>('button, [tabindex]')
      ?.focus()
  }

  if (variant === 'inline') {
    return (
      <SwatchGrid
        colors={colors}
        value={value}
        defaultValue={defaultValue}
        label={label}
        onPick={onChange}
        size={20}
      />
    )
  }

  return (
    <Popover
      trigger="click"
      placement={placement}
      open={open}
      onOpenChange={setOpen}
      getPopupContainer={getPopupContainer}
      destroyOnHidden
      paddingSize="xs"
      content={
        <div
          onKeyDown={(event) => {
            // Only the picker closes, not a modal around it.
            if (event.key !== 'Escape') return
            event.stopPropagation()
            close()
          }}
        >
          <SwatchGrid
            colors={colors}
            value={value}
            defaultValue={defaultValue}
            label={label}
            gridRef={gridRef}
            size={24}
            onPick={(next) => {
              onChange(next)
              close()
            }}
          />
        </div>
      }
    >
      <span ref={triggerRef} className="inline-flex">
        {children}
      </span>
    </Popover>
  )
}
