import { Tooltip } from '../tooltip'
import { Swatch, type SwatchProps } from '../swatch'

export type SwatchStripItem = {
  key: string
  /** Shown in a tooltip and read by assistive tech. */
  label: string
  swatch: Omit<SwatchProps, 'size'>
}

export type SwatchStripGroup = {
  key: string
  items: SwatchStripItem[]
}

export type SwatchStripProps = {
  /** Groups in display order; empty groups are skipped. */
  groups: SwatchStripGroup[]
  /** Swatches shown per group before a `+N` takes over. */
  max?: number
  /** Swatch side in px. */
  size?: number
}

/**
 * A compact run of swatches in groups, e.g. one square per affected item,
 * grouped by kind. Groups are separated by a thin rule rather than a wider
 * gap, so a group ending in `+N` doesn't read as farther from the next.
 */
export const SwatchStrip = ({
  groups,
  max = 5,
  size = 12,
}: SwatchStripProps) => {
  const visibleGroups = groups.filter((group) => group.items.length > 0)
  if (visibleGroups.length === 0) return null

  return (
    <div className="inline-flex flex-wrap items-center gap-y-1">
      {visibleGroups.map((group, index) => {
        const shown = group.items.slice(0, max)
        const overflow = group.items.length - shown.length
        return (
          <span key={group.key} className="inline-flex items-center">
            {index > 0 && (
              <span
                aria-hidden
                className="mx-2 inline-block w-px bg-[var(--j2-color-border-secondary)]"
                style={{ height: 12 }}
              />
            )}
            <span className="inline-flex items-center" style={{ gap: 2 }}>
              {shown.map((item) => (
                <Tooltip key={item.key} title={item.label}>
                  <span className="block" aria-label={item.label} role="img">
                    <Swatch {...item.swatch} size={size} />
                  </span>
                </Tooltip>
              ))}
              {overflow > 0 && (
                <span className="px-1 text-xs tabular-nums text-j2-text-secondary">
                  +{overflow}
                </span>
              )}
            </span>
          </span>
        )
      })}
    </div>
  )
}
