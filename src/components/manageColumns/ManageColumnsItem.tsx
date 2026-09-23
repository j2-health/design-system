import { memo, useCallback } from 'react'
import cx from 'classnames'
import { DotsSixIcon } from '@phosphor-icons/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Checkbox } from '../checkbox'

export const ManageColumnsItem = memo(function ManageColumnsItem({
  id,
  label,
  visible,
  pinned,
  onToggle,
}: {
  id: string
  label: string
  visible: boolean
  pinned: boolean
  onToggle: (id: string) => void
}) {
  const handleToggle = useCallback(() => onToggle(id), [onToggle, id])

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    // Boolean shorthand only disables dragging, not dropping onto a pinned row.
    disabled: { draggable: pinned, droppable: pinned },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cx(
        'flex items-center justify-between gap-2 py-1.5 pl-2 -ml-2 bg-white rounded',
        'has-[button:hover]:bg-j2-gray-2',
        isDragging && 'shadow-md z-10 relative',
        pinned && 'opacity-50'
      )}
    >
      <Checkbox
        checked={visible}
        disabled={pinned}
        onChange={pinned ? undefined : handleToggle}
        className={cx(
          // No gap: antd's own .ant-checkbox-label already pads before children.
          'flex items-center flex-1 min-w-0',
          pinned ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <span className="truncate text-j2-lg text-j2-text" title={label}>
          {label}
        </span>
      </Checkbox>
      {!pinned && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder ${label}`}
          className="p-1 text-j2-text cursor-grab active:cursor-grabbing"
        >
          <DotsSixIcon size={16} weight="bold" className="rotate-90" />
        </button>
      )}
    </div>
  )
})
