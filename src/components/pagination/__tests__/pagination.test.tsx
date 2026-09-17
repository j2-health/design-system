import { render, screen } from '@testing-library/react'
import { Pagination } from '../Pagination'
import { Table } from '../../table/Table'

describe('Pagination', () => {
  it('lets Table infer size-changer visibility from its rows', () => {
    render(
      <Table
        dataSource={Array.from({ length: 60 }, (_, id) => ({ id }))}
        columns={[{ dataIndex: 'id', title: 'ID' }]}
        pagination={{}}
      />
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('honors a custom size-changer boundary', () => {
    render(<Pagination total={20} totalBoundaryShowSizeChanger={10} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it.each([
    [50, undefined, false],
    [51, undefined, true],
    [100, false, false],
    [10, true, true],
  ])(
    'preserves size-changer visibility for total=%s and showSizeChanger=%s',
    (total, showSizeChanger, visible) => {
      render(<Pagination total={total} showSizeChanger={showSizeChanger} />)
      expect(screen.queryByRole('combobox') !== null).toBe(visible)
    }
  )

  it('should render correctly', () => {
    const { container } = render(
      <Pagination current={1} pageSize={10} total={100} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render with text labels for prev/next', () => {
    const { container } = render(
      <Pagination current={1} pageSize={10} total={100} paginationTextLabels />
    )
    expect(container).toMatchSnapshot()
  })

  it('should render size changer and total', () => {
    const { container } = render(
      <Pagination
        current={1}
        pageSize={10}
        total={100}
        showSizeChanger
        showTotal={(total) => `Total ${total} items`}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
