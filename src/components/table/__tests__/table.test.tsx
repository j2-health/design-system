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
})
