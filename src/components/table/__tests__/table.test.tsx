import { render } from '@testing-library/react'
import { Table } from '../Table'

describe('Table', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Table
        columns={[{ dataIndex: 'carrier', title: 'Carrier' }]}
        dataSource={[{ carrier: 'aetna' }]}
        rowKey="carrier"
      />
    )
    expect(container).toMatchSnapshot()
  })

  // Table.module.css targets antd's own class names for pinned cells and the
  // loading state. antd renames them between majors without a warning (5 -> 6
  // turned fix-left into fix-start and dropped ant-spin-blur), and the CSS
  // then silently matches nothing. Fail here instead.
  it('still emits the antd class names Table.module.css depends on', () => {
    const { container } = render(
      <Table
        loading
        alternatingRows
        rowKey="make"
        scroll={{ x: 800 }}
        columns={[
          { dataIndex: 'make', title: 'Make', fixed: 'left', width: 100 },
          { dataIndex: 'model', title: 'Model', width: 600 },
          { dataIndex: 'price', title: 'Price', fixed: 'right', width: 100 },
        ]}
        dataSource={[
          { make: 'Tesla', model: 'Model Y', price: 1 },
          { make: 'Ford', model: 'F-Series', price: 2 },
        ]}
      />
    )
    for (const cls of [
      'ant-table-cell-fix-start',
      'ant-table-cell-fix-end',
      'ant-table-cell-fix-start-shadow',
    ]) {
      expect(container.querySelector(`.${cls}`)).not.toBeNull()
    }
    expect(
      container.querySelector(
        '.ant-table-wrapper > .ant-spin-spinning > .ant-spin-container th'
      )
    ).not.toBeNull()
  })
})
