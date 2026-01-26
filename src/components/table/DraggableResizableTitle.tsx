import { Resizable, ResizeCallbackData } from 'react-resizable'
import { SyntheticEvent, CSSProperties } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type DraggableResizableTitleProps = {
  id?: string
  onResize?: (e: SyntheticEvent, data: ResizeCallbackData) => void
  width?: number | string
  minWidth?: number
  maxWidth?: number
  isDraggable?: boolean
  style?: CSSProperties
  className?: string
  [key: string]: unknown
}

export const DraggableResizableTitle = ({
  id,
  onResize,
  width,
  minWidth = 100,
  maxWidth = 1000,
  isDraggable = false,
  style,
  className,
  ...restProps
}: DraggableResizableTitleProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id || 'no-id',
    disabled: !isDraggable || !id,
  })

  // Use width if it's a number, otherwise fall back to minWidth
  const numericWidth = typeof width === 'number' ? width : (minWidth ?? 150)

  const dragStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: isDraggable ? 'grab' : undefined,
    ...style,
  }

  // If not resizable, just return draggable th
  if (!onResize) {
    return (
      <th
        ref={setNodeRef}
        style={dragStyle}
        className={className}
        {...attributes}
        {...(isDraggable ? listeners : {})}
        {...restProps}
      />
    )
  }

  // Resizable (and optionally draggable)
  return (
    <Resizable
      width={numericWidth}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      }
      onResize={onResize}
      minConstraints={[minWidth ?? 50, 0]}
      maxConstraints={[maxWidth, 0]}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th
        ref={setNodeRef}
        style={{ ...dragStyle, width: numericWidth }}
        className={className}
        {...attributes}
        {...(isDraggable ? listeners : {})}
        {...restProps}
      />
    </Resizable>
  )
}
