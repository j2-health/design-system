import { Tooltip } from '../tooltip'
import { Swatch, type SwatchVisualProps } from '../swatch'
import { mergeProps, useRender, type RenderProp } from '../../utils/useRender'

/**
 * Every item has an accessible name: a `label`, or failing that a string
 * `tooltip`.
 */
export type SwatchStripItem = {
  key: string
  swatch: Omit<SwatchVisualProps, 'size'>
} & (
  | {
      /** Read by assistive tech, and shown on hover unless `tooltip` is set. */
      label: string
      /** Shown on hover instead of `label`; `false` shows no tooltip. */
      tooltip?: React.ReactNode | false
    }
  | {
      label?: undefined
      /** Shown on hover and read by assistive tech. */
      tooltip: string
    }
)

export type SwatchStripGroup = {
  key: string
  items: SwatchStripItem[]
  /** Overrides the strip's `max` for this group, e.g. `Infinity` to expand it. */
  max?: number
  /**
   * The count shown as `+N` after the items, in place of how many `max`
   * hides. `+N` shows whenever it's above 0, even with nothing hidden, so a
   * group showing a subset can report how many it leaves out; `0` hides it.
   */
  overflow?: number
}

export type SwatchStripItemState = {
  item: SwatchStripItem
  group: SwatchStripGroup
}

export type SwatchStripOverflowState = {
  group: SwatchStripGroup
  /** The group's `overflow`, or else how many of its items are hidden. */
  count: number
}

export type SwatchStripProps = {
  /** Groups in display order; empty groups are skipped. */
  groups: SwatchStripGroup[]
  /** Swatches shown per group before a `+N` takes over. */
  max?: number
  /** Swatch side in px. */
  size?: number
  /**
   * Space in px between two groups on a line. The divider sits in the middle
   * of it.
   */
  groupGap?: number
  /** Space in px between wrapped lines. */
  rowGap?: number
  /**
   * Replaces each swatch's element, e.g. to make it a button. The props carry
   * the label and the swatch; spread them:
   * `(props, { item }) => <BareButton {...props} onClick={…} />`.
   * The default element is `role="img"`; a replacement keeps its own role.
   * Clicks are not stopped, so they reach a wrapping popover trigger unless
   * the handler calls `event.stopPropagation()`.
   */
  renderItem?: RenderProp<SwatchStripItemState>
  /**
   * Replaces the `+N` element. Same contract as `renderItem`; pass children
   * to change its text. To restyle it completely, leave out `className` when
   * spreading: `({ className, ...props }) => <span {...props} className="…" />`.
   */
  renderOverflow?: RenderProp<SwatchStripOverflowState>
}

const Item = ({
  item,
  group,
  size,
  render,
}: SwatchStripItemState & {
  size: number
  render?: RenderProp<SwatchStripItemState>
}) =>
  useRender({
    render,
    state: { item, group },
    defaultTagName: 'span',
    props: mergeProps(
      {
        className: 'block',
        // The type guarantees a string tooltip when there's no label.
        'aria-label': item.label ?? (item.tooltip as string),
        children: <Swatch {...item.swatch} size={size} />,
      },
      // An image only by default: a replacement element keeps its own role.
      render ? undefined : { role: 'img' }
    ),
  })

const Overflow = ({
  render,
  ...state
}: SwatchStripOverflowState & {
  render?: RenderProp<SwatchStripOverflowState>
}) =>
  useRender({
    render,
    state,
    defaultTagName: 'span',
    props: {
      className: 'pl-1 text-xs tabular-nums text-j2-text-secondary',
      children: `+${state.count}`,
    },
  })

/**
 * A compact run of swatches in groups, e.g. one square per affected item,
 * grouped by kind. Groups are separated by a thin rule rather than a wider
 * gap, so a group ending in `+N` doesn't read as farther from the next.
 */
export const SwatchStrip = ({
  groups,
  max = 5,
  size = 12,
  groupGap = 17,
  rowGap = 4,
  renderItem,
  renderOverflow,
}: SwatchStripProps) => {
  const visibleGroups = groups.filter((group) => group.items.length > 0)
  if (visibleGroups.length === 0) return null

  // Each divider hangs in the gap before its group. On a group that starts a
  // wrapped line, it falls left of the root and the clip hides it. The
  // padding, cancelled by the margin, keeps the clip off the focus rings of
  // items at the edges, and stays narrow enough to hide a wrapped divider.
  const inset = Math.max(0, Math.min(4, Math.floor((groupGap - 1) / 2)))

  return (
    <div
      className="inline-flex flex-wrap items-center overflow-clip"
      style={{ columnGap: groupGap, rowGap, padding: inset, margin: -inset }}
    >
      {visibleGroups.map((group, index) => {
        const shown = group.items.slice(0, group.max ?? max)
        const overflow = group.overflow ?? group.items.length - shown.length
        return (
          <span
            key={group.key}
            className="relative inline-flex items-center"
            style={{ gap: 2 }}
          >
            {index > 0 && (
              <span
                aria-hidden
                className="absolute top-1/2 w-px -translate-y-1/2 bg-[var(--j2-color-border-secondary)]"
                style={{ height: 12, left: -(groupGap + 1) / 2 }}
              />
            )}
            {shown.map((item) => {
              const swatch = (
                <Item
                  key={item.key}
                  item={item}
                  group={group}
                  size={size}
                  render={renderItem}
                />
              )
              const tooltip = item.tooltip ?? item.label
              return tooltip === false ? (
                swatch
              ) : (
                <Tooltip key={item.key} title={tooltip}>
                  {swatch}
                </Tooltip>
              )
            })}
            {overflow > 0 && (
              <Overflow
                group={group}
                count={overflow}
                render={renderOverflow}
              />
            )}
          </span>
        )
      })}
    </div>
  )
}
