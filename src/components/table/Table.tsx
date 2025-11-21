import {
  Table as AntdTable,
  SpinProps,
  TableProps,
  Select,
  Button,
  SelectProps,
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
import { ComponentProps } from 'react'
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

  const columns = props.columns?.map((column) => ({
    ...column,
    sortIcon: column.sortIcon ?? defaultSortIcon,
  }))

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

Table.Column = <T extends AnyObject>(props: ColumnProps<T>) => {
  return <AntdTable.Column<T> {...props} sortIcon={defaultSortIcon} />
}
Table.Summary = AntdTable.Summary

export type { TableColumnType } from 'antd'
export { Table }
