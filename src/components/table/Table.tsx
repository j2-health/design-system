import { Table as AntdTable, TableProps } from 'antd'

type Props = Expand<TableProps>

const Table = ({ ...props }: Props) => {
  return (
    <div className={props.className}>
      <AntdTable {...props} />
    </div>
  )
}

export { Table }
