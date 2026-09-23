import { useMemo } from 'react'

import { Button } from '../button'
import type { ManageColumnsColumn } from './ManageColumnsPanel'

export type SelectAllProps = {
  /** Same `columns` passed to the paired `ManageColumnsPanel`. */
  columns: ManageColumnsColumn[]
  onToggle?: (id: string) => void
  /** Batched select-all/clear-all handler — prefer this over the `onToggle` loop fallback, which can drop updates under a closure-captured state snapshot. */
  onToggleAll?: (ids: string[], visible: boolean) => void
}

/**
 * Select-all/clear-all control, composed by `ManageColumnsPanel` itself
 * above its description. Kept as its own component (not inlined) so its
 * label/toggle logic is testable independent of the panel's drag-reorder
 * machinery.
 */
export function SelectAll({ columns, onToggle, onToggleAll }: SelectAllProps) {
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
    <Button type="text" size="small" onClick={handleSelectAllToggle}>
      {label}
    </Button>
  )
}
