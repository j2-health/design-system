import { AgGridReact, AgGridReactProps } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import 'ag-grid-community/styles/ag-theme-material.css'

import cx from 'classnames'

import './Table.css'

type MergedProps<T> = AgGridReactProps<T> & {
  bordered?: boolean
}

type Props<T> = Expand<MergedProps<T>>

const Table = <T,>({ bordered = false, ...props }: Props<T>) => {
  return (
    <div
      className={cx(
        props.className,
        'ag-theme-quartz',
        bordered ? 'ag-custom-theme--bordered' : ''
      )}
    >
      <AgGridReact<T> {...props} />
    </div>
  )
}

export { Table }
