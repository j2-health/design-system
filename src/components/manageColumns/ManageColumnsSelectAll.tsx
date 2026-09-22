import { useMemo } from 'react'

import { Button } from '../button'
import type { ManageColumnsColumn } from './ManageColumnsPanel'

export type ManageColumnsSelectAllProps = {
  /** Same `columns` passed to the paired `ManageColumnsPanel`. */
  columns: ManageColumnsColumn[]
  onToggle?: (id: string) => void
  /** Batched select-all/clear-all handler — prefer this over the `onToggle` loop fallback, which can drop updates under a closure-captured state snapshot. */
  onToggleAll?: (ids: string[], visible: boolean) => void
}

/**
 * Select-all/clear-all control for `ManageColumnsPanel`, rendered
 * separately so a consumer can place it in their own panel header
 * (permanently visible, never scrolled away) instead of inside the
 * panel's own scrolling content.
 */
export function ManageColumnsSelectAll({
  columns,
  onToggle,
  onToggleAll,
}: ManageColumnsSelectAllProps) {
  const toggleable = useMemo(() => columns.filter((c) => !c.pinned), [columns])
  const allVisible = toggleable.length > 0 && toggleable.every((c) => c.visible)
  const label = allVisible ? 'Clear all' : 'Select all'

  if (toggleable.length === 0) return null

  const handleSelectAllToggle = () => {
    const affected = toggleable.filter((c) => c.visible === allVisible)
    if (onToggleAll) {
      onToggleAll(
        affected.map((c) => c.id),
        !allVisible
      )
      return
    }
    for (const column of affected) {
      onToggle?.(column.id)
    }
  }

  return (
    <div className="text-j2-primary">
      <Button
        type="text"
        size="small"
        aria-label={label}
        title={label}
        onClick={handleSelectAllToggle}
      >
        {label}
      </Button>
    </div>
  )
}
