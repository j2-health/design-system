import { render } from '@testing-library/react'
import { Table } from '../Table'

type Row = { id: string; name: string; status: string }

const columns = [
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'status', title: 'Status' },
]

const rows: Row[] = [
  { id: 'row-1', name: 'alpha', status: 'pending' },
  { id: 'row-2', name: 'beta', status: 'pending' },
]

const rowKeys = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('tbody tr[data-row-key]')).map((tr) =>
    tr.getAttribute('data-row-key')
  )

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

  describe('rowKey', () => {
    it('honors a caller-supplied string rowKey', () => {
      const { container } = render(
        <Table columns={columns} dataSource={rows} rowKey="id" />
      )

      expect(rowKeys(container)).toEqual(['row-1', 'row-2'])
    })

    it('honors a caller-supplied function rowKey', () => {
      const { container } = render(
        <Table
          columns={columns}
          dataSource={rows}
          rowKey={(record) => `key-${record.id}`}
        />
      )

      expect(rowKeys(container)).toEqual(['key-row-1', 'key-row-2'])
    })

    it('falls back to the serialized record when no rowKey is given', () => {
      const { container } = render(
        <Table columns={columns} dataSource={rows} />
      )

      expect(rowKeys(container)).toEqual(rows.map((r) => JSON.stringify(r)))
    })

    it('falls back to the serialized record when rowKey is explicitly undefined', () => {
      const { container } = render(
        <Table columns={columns} dataSource={rows} rowKey={undefined} />
      )

      expect(rowKeys(container)).toEqual(rows.map((r) => JSON.stringify(r)))
    })

    it('keeps a row mounted across an unrelated field change', () => {
      const { container, rerender } = render(
        <Table columns={columns} dataSource={rows} rowKey="id" />
      )
      const before = container.querySelector('tr[data-row-key="row-1"]')

      rerender(
        <Table
          columns={columns}
          dataSource={[{ ...rows[0], status: 'complete' }, rows[1]]}
          rowKey="id"
        />
      )

      expect(container.querySelector('tr[data-row-key="row-1"]')).toBe(before)
    })

    it('remounts a row on any field change under the default rowKey', () => {
      const { container, rerender } = render(
        <Table columns={columns} dataSource={rows} />
      )
      const before = container.querySelector('tbody tr[data-row-key]')

      rerender(
        <Table
          columns={columns}
          dataSource={[{ ...rows[0], status: 'complete' }, rows[1]]}
        />
      )

      expect(container.querySelector('tbody tr[data-row-key]')).not.toBe(before)
    })
  })
})
