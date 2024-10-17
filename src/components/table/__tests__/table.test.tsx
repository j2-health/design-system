import { render } from '@testing-library/react'
import { Table } from '../Table'

describe('Table', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Table
        columnDefs={[{ field: 'carrier' }]}
        rowData={[{ carrier: 'aetna' }]}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
