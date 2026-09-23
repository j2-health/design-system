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
import { SelectAll } from './SelectAll'

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
  const visibleCount = toggleable.filter((c) => c.visible).length

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
      {toggleable.length > 0 && (
        <div className="sticky -top-4 z-10 -mt-4 -mx-4 pt-3 px-4 pb-2 mb-3 bg-white border-b border-j2-border-secondary flex items-baseline justify-between">
          <span className="font-semibold text-sm text-j2-text">
            {visibleCount}/{toggleable.length} Columns Shown
          </span>
          <SelectAll
            columns={columns}
            onToggle={onToggle}
            onToggleAll={onToggleAll}
          />
        </div>
      )}
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
    </>
  )
}
