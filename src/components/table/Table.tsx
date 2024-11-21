import { Table as AntdTable, TableProps } from 'antd'
import cx from 'classnames'

import s from './Table.module.css'

type MergedProps = TableProps & {
  verticalBorders?: boolean
}

type Props = Expand<MergedProps>

const Table = ({ verticalBorders, ...props }: Props) => {
  return (
    <div
      className={cx(props.className, {
        [s.bordered]: props.bordered && !verticalBorders,
      })}
    >
      <AntdTable {...props} />
    </div>
  )
}

export { Table }
