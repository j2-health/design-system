import { Table as AntdTable, SpinProps, TableProps } from 'antd'
import cx from 'classnames'

import s from './Table.module.css'
import { Spinner } from '../spinner'
import { CaretDown, CaretUp, CaretUpDown } from '@phosphor-icons/react'
import { ComponentProps } from 'react'
import { AnyObject } from 'antd/es/_util/type'

type MergedProps<T> = TableProps<T> & {
  verticalBorders?: boolean
  columns?: TableProps<T>['columns']
}

type Props<T> = Expand<MergedProps<T>>

export const defaultSortIcon = ({
  sortOrder,
}: {
  sortOrder: 'ascend' | 'descend' | null
}) => {
  if (sortOrder == 'ascend') {
    return <CaretUp />
  } else if (sortOrder == 'descend') {
    return <CaretDown />
  }

  return <CaretUpDown />
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Table = <T = any,>({ verticalBorders, ...props }: Props<T>) => {
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
      ? {
          ...props.loading,
          ...defaultLoadingProps,
        }
      : props.loading && defaultLoadingProps

  const columns = props.columns?.map((column) => ({
    ...column,
    sortIcon: defaultSortIcon,
  }))

  return (
    <div
      className={cx(props.className, {
        [s.bordered]: props.bordered && !verticalBorders,
      })}
    >
      <AntdTable<T>
        showSorterTooltip={{ target: 'sorter-icon' }}
        {...props}
        loading={loading}
        columns={columns}
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

Table.Column = <T extends AnyObject>(props: ColumnProps<T>) => {
  return <AntdTable.Column<T> {...props} sortIcon={defaultSortIcon} />
}
Table.Summary = AntdTable.Summary

export type { TableColumnType } from 'antd'
export { Table }
