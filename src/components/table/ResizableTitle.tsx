import { Resizable, ResizeCallbackData } from 'react-resizable'
import {
  SyntheticEvent,
  CSSProperties,
  useState,
  useCallback,
  useRef,
} from 'react'

type ResizableTitleProps = {
  onResize?: (e: SyntheticEvent, data: ResizeCallbackData) => void
  width?: number | string
  minWidth?: number
  maxWidth?: number
  style?: CSSProperties
  className?: string
  id?: string
  isDraggable?: boolean
  [key: string]: unknown
}

export const ResizableTitle = ({
  onResize,
  width,
  minWidth = 20,
  maxWidth = 1000,
  style,
  className,
  id: _id,
  isDraggable: _isDraggable,
  ...restProps
}: ResizableTitleProps) => {
  // Use width if it's a number, otherwise fall back to a reasonable default
  const numericWidth = typeof width === 'number' ? width : 150

  // Track width locally during resize for smooth dragging
  const [resizingWidth, setResizingWidth] = useState<number | null>(null)
  const isResizingRef = useRef(false)
  const displayWidth = resizingWidth ?? numericWidth

  const handleResize = useCallback(
    (_e: SyntheticEvent, { size }: ResizeCallbackData) => {
      isResizingRef.current = true
      setResizingWidth(size.width)
    },
    []
  )

  const handleResizeStop = useCallback(
    (e: SyntheticEvent, data: ResizeCallbackData) => {
      setResizingWidth(null)
      isResizingRef.current = false
      onResize?.(e, data)
    },
    [onResize]
  )

  // If no resize handler, render plain th
  if (!onResize) {
    return <th style={style} className={className} {...restProps} />
  }

  return (
    <Resizable
      width={displayWidth}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      }
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      minConstraints={[minWidth ?? 50, 0]}
      maxConstraints={[maxWidth, 0]}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th
        className={className}
        {...restProps}
        style={{ ...style, width: displayWidth }}
      />
    </Resizable>
  )
}
