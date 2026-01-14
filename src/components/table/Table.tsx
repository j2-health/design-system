import {
  Table as AntdTable,
  SpinProps,
  TableProps,
  Select,
  Button,
  SelectProps,
  Tooltip,
} from 'antd'
import cx from 'classnames'
import s from './Table.module.css'
import { Spinner } from '../spinner'
import {
  CaretDownIcon,
  CaretUpIcon,
  CaretUpDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  DotsThreeIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
} from '@phosphor-icons/react'
import { ComponentProps, ReactNode, SyntheticEvent, useMemo } from 'react'
import { AnyObject } from 'antd/es/_util/type'
import { ResizableTitle } from './ResizableTitle'
import { ResizeCallbackData } from 'react-resizable'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { DraggableResizableTitle } from './DraggableResizableTitle'

type MergedProps<T> = TableProps<T> & {
  verticalBorders?: boolean
  alternatingRows?: boolean
  columns?: TableProps<T>['columns']
  paginationTextLabels?: boolean
  resizable?: boolean
  onColumnResize?: (dataIndex: string, width: number) => void
  draggableColumns?: boolean
  onColumnOrderChange?: (newOrder: string[]) => void
}

type Props<T> = Expand<MergedProps<T>>

export const defaultSortIcon = ({
  sortOrder,
}: {
  sortOrder: 'ascend' | 'descend' | null
}) => {
  if (sortOrder == 'ascend') return <CaretUpIcon />
  if (sortOrder == 'descend') return <CaretDownIcon />
  return <CaretUpDownIcon />
}

const renderIconButton = (
  icon: React.ReactNode,
  isSmallPagination?: boolean,
  customClassName?: string
) => (
  <Button
    type="link"
    size={isSmallPagination ? 'small' : 'middle'}
    className={cx(customClassName, isSmallPagination ? '!w-6' : '!w-8')}
  >
    {icon}
  </Button>
)

const renderJumpItem = (
  icon: React.ReactNode,
  doubleIcon: React.ReactNode,
  isSmallPagination?: boolean
) => (
  <a className="ant-pagination-item-link">
    <div className="ant-pagination-item-container">
      <span className="ant-pagination-item-ellipsis">
        {renderIconButton(icon, isSmallPagination, s['jump-button'])}
      </span>
      <span className="ant-pagination-item-link-icon">
        {renderIconButton(doubleIcon, isSmallPagination, s['jump-button'])}
      </span>
    </div>
  </a>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
const Table = <T extends unknown = any>({
  verticalBorders,
  alternatingRows,
  paginationTextLabels = false,
  resizable = false,
  onColumnResize,
  draggableColumns = false,
  onColumnOrderChange,
  ...props
}: Props<T>) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const defaultLoadingProps: SpinProps = {
    indicator: <Spinner className="!w-fit !h-fit !mx-0 translate-x-[-50%]" />,
    tip: (
      <div className="mt-20">
        <h4>Loading this chart</h4>
        <span className="text-lg">Please wait a moment</span>
      </div>
    ),
  }

  const loading: SpinProps | boolean | undefined =
    typeof props.loading == 'object'
      ? { ...props.loading, ...defaultLoadingProps }
      : props.loading && defaultLoadingProps

  const isSimpleValue = (
    value: unknown
  ): value is string | number | boolean => {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    )
  }

  // Helper to extract text content from React elements
  const extractTextContent = (node: unknown): string | null => {
    if (isSimpleValue(node)) {
      return String(node)
    }

    // Check if it's a React element with simple text children
    if (
      node &&
      typeof node === 'object' &&
      'props' in node &&
      node.props &&
      typeof node.props === 'object' &&
      'children' in node.props
    ) {
      const children = node.props.children
      if (isSimpleValue(children)) {
        return String(children)
      }
    }

    return null
  }

  const handleResize =
    (dataIndex: string) =>
    (_e: SyntheticEvent, { size }: ResizeCallbackData) => {
      if (onColumnResize) {
        onColumnResize(dataIndex, size.width)
      }
    }

  // Get column dataIndex values for sortable context
  const columnIds = useMemo(() => {
    return (
      props.columns?.map((col) => {
        const dataIndex = (col as { dataIndex?: string | number }).dataIndex
        return String(dataIndex ?? col.key ?? '')
      }) ?? []
    )
  }, [props.columns])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !onColumnOrderChange) return

    const oldIndex = columnIds.indexOf(String(active.id))
    const newIndex = columnIds.indexOf(String(over.id))

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(columnIds, oldIndex, newIndex)
      onColumnOrderChange(newOrder)
    }
  }

  const columns = props.columns?.map((column) => {
    const hasEllipsis =
      column.ellipsis === true ||
      (typeof column.ellipsis === 'object' && column.ellipsis)

    const originalRender = column.render
    const dataIndex = String(
      (column as { dataIndex?: string | number }).dataIndex ?? column.key ?? ''
    )
    const isFixed = (column as { fixed?: boolean | string }).fixed

    return {
      ...column,
      sortIcon: column.sortIcon ?? defaultSortIcon,
      ellipsis: hasEllipsis
        ? {
            showTitle: false, // Disable default browser tooltip
          }
        : column.ellipsis,
      // Add onHeaderCell for resizable/draggable columns
      ...((resizable || draggableColumns) && dataIndex
        ? {
            onHeaderCell: () =>
              ({
                id: dataIndex,
                width: column.width,
                minWidth: (column as { minWidth?: number }).minWidth,
                onResize: resizable ? handleResize(dataIndex) : undefined,
                isDraggable: draggableColumns && !isFixed,
              }) as Record<string, unknown>,
          }
        : {}),
      render: (value: unknown, record: T, index: number): ReactNode => {
        const renderedContent = originalRender
          ? originalRender(value, record, index)
          : value

        // Try to extract text content for tooltip
        const tooltipText = extractTextContent(renderedContent)

        // If we can extract text content, wrap with tooltip
        if (tooltipText) {
          // For simple values, wrap in a span
          if (isSimpleValue(renderedContent)) {
            return (
              <Tooltip title={tooltipText} arrow={false}>
                <span className={hasEllipsis ? 'block truncate' : undefined}>
                  {renderedContent}
                </span>
              </Tooltip>
            )
          }

          // For React elements, wrap the element itself
          return (
            <Tooltip title={tooltipText} arrow={false}>
              <div>{renderedContent as ReactNode}</div>
            </Tooltip>
          )
        }

        // Complex components without extractable text - return as is
        return renderedContent as ReactNode
      },
    }
  })

  const isSmallPagination =
    (typeof props.pagination === 'object' &&
      props.pagination.size == 'small') ||
    props.size == 'small'

  const paginationLocale = {
    jump_to: `Go to\u00A0${isSmallPagination ? ':\u00A0\u00A0\u00A0' : ''}`,
    page: isSmallPagination ? '' : 'page',
  }

  const itemRender = (
    _page: number,
    type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
    element: React.ReactNode
  ) => {
    if (type === 'prev') {
      return (
        <a>
          {paginationTextLabels
            ? 'Previous'
            : renderIconButton(<CaretLeftIcon />, isSmallPagination)}
        </a>
      )
    }

    if (type === 'next') {
      return (
        <a>
          {paginationTextLabels
            ? 'Next'
            : renderIconButton(<CaretRightIcon />, isSmallPagination)}
        </a>
      )
    }

    if (type === 'jump-prev') {
      return renderJumpItem(
        <DotsThreeIcon />,
        <CaretDoubleLeftIcon />,
        isSmallPagination
      )
    }

    if (type === 'jump-next') {
      return renderJumpItem(
        <DotsThreeIcon />,
        <CaretDoubleRightIcon />,
        isSmallPagination
      )
    }

    return element
  }

  const paginationConfig = props.pagination
    ? {
        ...props.pagination,
        locale: { ...paginationLocale, ...props.pagination.locale },
        selectComponentClass: (selectProps: SelectProps) => (
          <Select {...selectProps} suffixIcon={<CaretDownIcon />} />
        ),
        itemRender,
      }
    : false

  // Use DraggableResizableTitle when dragging is enabled, ResizableTitle otherwise
  const headerCellComponent =
    draggableColumns || resizable
      ? draggableColumns
        ? DraggableResizableTitle
        : ResizableTitle
      : undefined

  const customComponents = headerCellComponent
    ? {
        header: {
          cell: headerCellComponent,
        },
      }
    : undefined

  const tableContent = (
    <div
      className={cx(props.className, {
        [s.bordered]: props.bordered && !verticalBorders,
        [s.alternatingRows]: alternatingRows,
      })}
    >
      <AntdTable<T>
        showSorterTooltip={{ target: 'sorter-icon' }}
        {...props}
        components={customComponents}
        loading={loading}
        columns={columns}
        pagination={paginationConfig}
        rowKey={(record) => JSON.stringify(record)}
        locale={{
          emptyText: (
            <div
              style={{ height: props.scroll?.y || 400, width: 'content-fit' }}
            />
          ),
        }}
      />
    </div>
  )

  // Wrap with DndContext if draggable columns are enabled
  if (draggableColumns) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columnIds}
          strategy={horizontalListSortingStrategy}
        >
          {tableContent}
        </SortableContext>
      </DndContext>
    )
  }

  return tableContent
}

type ColumnProps<T extends AnyObject> = Expand<
  ComponentProps<typeof AntdTable.Column<T>>
>

const TableColumn = <T extends AnyObject>(props: ColumnProps<T>) => {
  return <AntdTable.Column<T> {...props} sortIcon={defaultSortIcon} />
}
TableColumn.displayName = 'Table.Column'

Table.Column = TableColumn
Table.Summary = AntdTable.Summary

export type { TableColumnType } from 'antd'
export { Table }
