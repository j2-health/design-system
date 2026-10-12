import { fireEvent, render, within } from '@testing-library/react'
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

  describe('row keys', () => {
    // antd writes each row's key into the DOM as `data-row-key`.
    const rowKeys = (container: HTMLElement) =>
      Array.from(
        container.querySelectorAll<HTMLElement>('tbody tr[data-row-key]')
      ).map((row) => row.getAttribute('data-row-key'))

    const people = () => [
      { name: 'Ada', email: 'ada@example.com', note: 'first private note' },
      {
        name: 'Grace',
        email: 'grace@example.com',
        note: 'second private note',
      },
      {
        name: 'Edsger',
        email: 'edsger@example.com',
        note: 'third private note',
      },
    ]
    const nameColumn = [{ dataIndex: 'name', title: 'Name' }]

    let warn: ReturnType<typeof vi.spyOn>
    beforeEach(() => {
      warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    })
    afterEach(() => {
      warn.mockRestore()
    })

    it('uses a rowKey field name passed by the caller', () => {
      const { container } = render(
        <Table columns={nameColumn} dataSource={people()} rowKey="email" />
      )
      expect(rowKeys(container)).toEqual([
        'ada@example.com',
        'grace@example.com',
        'edsger@example.com',
      ])
    })

    it('uses a rowKey function passed by the caller', () => {
      const { container } = render(
        <Table
          columns={nameColumn}
          dataSource={people()}
          rowKey={(record) => `person-${record.name}`}
        />
      )
      expect(rowKeys(container)).toEqual([
        'person-Ada',
        'person-Grace',
        'person-Edsger',
      ])
    })

    it('defaults to record.key, then record.id', () => {
      const { container } = render(
        <Table
          columns={nameColumn}
          dataSource={[
            { key: 'k1', id: 1, name: 'Ada' },
            { id: 2, name: 'Grace' },
            { key: 0, name: 'Edsger' },
          ]}
        />
      )
      expect(rowKeys(container)).toEqual(['k1', '2', '0'])
      expect(warn).not.toHaveBeenCalled()
    })

    it('never writes record contents into the DOM when records have no key', () => {
      const data = people()
      const { container } = render(
        <Table columns={nameColumn} dataSource={data} />
      )

      const keys = rowKeys(container)
      expect(keys).toHaveLength(data.length)
      for (const key of keys) {
        for (const record of data) {
          for (const value of Object.values(record)) {
            expect(key).not.toContain(value)
          }
        }
        expect(key).not.toContain('{')
      }

      // Fields no column displays appear nowhere in the rendered table.
      const html = container.innerHTML
      for (const record of data) {
        expect(html).not.toContain(record.email)
        expect(html).not.toContain(record.note)
      }
    })

    it('falls back to keys that are unique and stable', () => {
      const { container, rerender } = render(
        <Table columns={nameColumn} dataSource={people()} />
      )
      const first = rowKeys(container)
      expect(first).toEqual(['row-0', 'row-1', 'row-2'])
      expect(new Set(first).size).toBe(first.length)

      // Fresh objects with the same order, as a refetch or an un-memoised
      // `.map()` in the caller would produce, keep the same keys.
      rerender(<Table columns={nameColumn} dataSource={people()} />)
      expect(rowKeys(container)).toEqual(first)
    })

    it('keeps fallback keys attached to their rows through client-side sorting', () => {
      const { container, getByText } = render(
        <Table
          columns={[
            {
              dataIndex: 'name',
              title: 'Name',
              sorter: (a: { name: string }, b: { name: string }) =>
                a.name.localeCompare(b.name),
            },
          ]}
          dataSource={people()}
        />
      )
      const keyOf = (name: string) =>
        getByText(name).closest('tr')?.getAttribute('data-row-key')
      const before = ['Ada', 'Grace', 'Edsger'].map(keyOf)

      fireEvent.click(getByText('Name'))

      expect(
        Array.from(container.querySelectorAll('tbody tr td')).map(
          (cell) => cell.textContent
        )
      ).toEqual(['Ada', 'Edsger', 'Grace'])
      expect(['Ada', 'Grace', 'Edsger'].map(keyOf)).toEqual(before)
    })

    it('gives fallback keys that differ across pages and select the right row', () => {
      const onChange = vi.fn()
      const data = [...people(), { name: 'Barbara', email: '', note: '' }]
      const { container, getByTitle } = render(
        <Table
          columns={nameColumn}
          dataSource={data}
          pagination={{ pageSize: 2 }}
          rowSelection={{ onChange }}
        />
      )
      expect(rowKeys(container)).toEqual(['row-0', 'row-1'])

      fireEvent.click(getByTitle('2'))
      expect(rowKeys(container)).toEqual(['row-2', 'row-3'])

      const secondPageFirstRow = container.querySelector<HTMLElement>(
        'tbody tr[data-row-key="row-2"]'
      )!
      fireEvent.click(within(secondPageFirstRow).getByRole('checkbox'))
      expect(onChange).toHaveBeenLastCalledWith(
        ['row-2'],
        [data[2]],
        expect.anything()
      )
    })

    it('keys nested rows by their path', () => {
      const { container } = render(
        <Table
          columns={nameColumn}
          dataSource={[
            { name: 'Parent', children: [{ name: 'Child' }] },
            { name: 'Other' },
          ]}
          expandable={{ defaultExpandAllRows: true }}
        />
      )
      expect(rowKeys(container)).toEqual(['row-0', 'row-0-0', 'row-1'])
    })

    it('warns once in development when falling back to positions', () => {
      const { rerender } = render(
        <Table columns={nameColumn} dataSource={people()} />
      )
      rerender(<Table columns={nameColumn} dataSource={people()} />)
      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn.mock.calls[0][0]).toMatch(/Pass `rowKey`/)
    })
  })
})
