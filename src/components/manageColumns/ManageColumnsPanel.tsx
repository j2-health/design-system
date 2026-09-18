import { useMemo, type ReactNode } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { ManageColumnsItem } from './ManageColumnsItem'

const noop = () => {}

export type ManageColumnsColumn = {
  id: string
  label: string
  visible: boolean
  /** Always visible, not draggable. Put pinned columns first in `columns`. */
  pinned?: boolean
}

export type ManageColumnsPanelProps = {
  /** Columns in display order. Put any `pinned` columns first. */
  columns: ManageColumnsColumn[]
  onToggle?: (id: string) => void
  /** Batched select-all/clear-all handler — prefer this over the `onToggle` loop fallback, which can drop updates under a closure-captured state snapshot. */
  onToggleAll?: (ids: string[], visible: boolean) => void
  onReorder?: (orderedIds: string[]) => void
  description?: ReactNode
}

export function ManageColumnsPanel({
  columns,
  onToggle,
  onToggleAll,
  onReorder,
  description,
}: ManageColumnsPanelProps) {
  const toggleable = useMemo(() => columns.filter((c) => !c.pinned), [columns])
  const allVisible = toggleable.length > 0 && toggleable.every((c) => c.visible)
  const showSelectAllFooter = toggleable.length > 0

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const pinnedIds = useMemo(
    () => columns.filter((c) => c.pinned).map((c) => c.id),
    [columns]
  )
  const itemIds = useMemo(() => toggleable.map((c) => c.id), [toggleable])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = itemIds.indexOf(active.id as string)
    const to = itemIds.indexOf(over.id as string)
    if (from === -1 || to === -1) return
    onReorder?.([...pinnedIds, ...arrayMove(itemIds, from, to)])
  }

  return (
    <>
      {description && (
        <p className="text-sm text-j2-text mb-4">{description}</p>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col">
            {columns.map((column) => (
              <ManageColumnsItem
                key={column.id}
                id={column.id}
                label={column.label}
                visible={column.pinned ? true : column.visible}
                pinned={Boolean(column.pinned)}
                onToggle={onToggle ?? noop}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {showSelectAllFooter && (
        <div className="mt-2 pt-1 border-t border-j2-border-secondary">
          <button
            type="button"
            aria-label={allVisible ? 'Clear all' : 'Select all'}
            title={allVisible ? 'Clear all' : 'Select all'}
            onClick={handleSelectAllToggle}
            className="w-full text-center font-semibold text-sm py-1.5 rounded cursor-pointer text-j2-primary hover:bg-j2-primary-bg-hover bg-transparent border-0"
          >
            {allVisible ? 'Clear all' : 'Select all'}
          </button>
        </div>
      )}
    </>
  )
}
