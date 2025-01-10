import { Table as AntdTable, TableProps } from 'antd'
import cx from 'classnames'

import s from './Table.module.css'

type MergedProps<T> = TableProps<T> & {
  verticalBorders?: boolean
}

type Props<T> = Expand<MergedProps<T>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Table = <T = any,>({ verticalBorders, ...props }: Props<T>) => {
  return (
    <div
      className={cx(props.className, {
        [s.bordered]: props.bordered && !verticalBorders,
      })}
    >
      <AntdTable<T> {...props} />
    </div>
  )
}

Table.Column = AntdTable.Column
Table.Summary = AntdTable.Summary

export type { TableColumnType } from 'antd'
export { Table }
