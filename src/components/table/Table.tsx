import { Table as AntdTable, SpinProps, TableProps, Tooltip } from 'antd'
import cx from 'classnames'
import s from './Table.module.css'
import { Spinner } from '../spinner'
import { withDesignSystemPaginationOverrides } from '../pagination/Pagination'
import {
  CaretDownIcon,
  CaretUpIcon,
  CaretUpDownIcon,
} from '@phosphor-icons/react'
import { ComponentProps, ReactNode } from 'react'
import { AnyObject } from 'antd/es/_util/type'

type MergedProps<T> = TableProps<T> & {
  verticalBorders?: boolean
  alternatingRows?: boolean
  columns?: TableProps<T>['columns']
  paginationTextLabels?: boolean
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-constraint
const Table = <T extends unknown = any>({
  verticalBorders,
  alternatingRows,
  paginationTextLabels = false,
  ...props
}: Props<T>) => {
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

  const columns = props.columns?.map((column) => {
    const hasEllipsis =
      column.ellipsis === true ||
      (typeof column.ellipsis === 'object' && column.ellipsis)

    const originalRender = column.render

    return {
      ...column,
      sortIcon: column.sortIcon ?? defaultSortIcon,
      ellipsis: hasEllipsis
        ? {
            showTitle: false, // Disable default browser tooltip
          }
        : column.ellipsis,
      render: (value: unknown, record: T, index: number): ReactNode => {
        const renderedContent = originalRender
          ? originalRender(value, record, index)
          : value

        // Render null/undefined as dashes with no tooltip
        if (renderedContent == null) {
          return <span className="text-j2-text-secondary">--</span>
        }

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

  const paginationConfig = props.pagination
    ? withDesignSystemPaginationOverrides(
        typeof props.pagination === 'object' ? props.pagination : {},
        {
          paginationTextLabels,
          isSmall:
            (typeof props.pagination === 'object' &&
              props.pagination.size === 'small') ||
            props.size === 'small',
        }
      )
    : false

  return (
    <div
      className={cx(props.className, {
        [s.bordered]: props.bordered && !verticalBorders,
        [s.alternatingRows]: alternatingRows,
      })}
    >
      <AntdTable<T>
        showSorterTooltip={{ target: 'sorter-icon' }}
        {...props}
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
