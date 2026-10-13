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
    const HASH_KEY = /^r-[0-9a-z]+(~\d+)?$/

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
    })

    it('falls back to a hash and never writes record contents into the DOM', () => {
      const data = people()
      const { container } = render(
        <Table columns={nameColumn} dataSource={data} />
      )

      const keys = rowKeys(container)
      expect(keys).toHaveLength(data.length)
      expect(new Set(keys).size).toBe(keys.length)
      for (const key of keys) expect(key).toMatch(HASH_KEY)

      // Fields no column displays appear nowhere in the rendered table.
      const html = container.innerHTML
      for (const record of data) {
        expect(html).not.toContain(record.email)
        expect(html).not.toContain(record.note)
      }
    })

    it('keys rows by content: stable across fresh objects, reordering and property order', () => {
      const { container, rerender } = render(
        <Table columns={nameColumn} dataSource={people()} />
      )
      const [ada, grace, edsger] = rowKeys(container)

      // Fresh but equal objects, as a refetch or an un-memoised `.map()`
      // would produce, keep their keys.
      rerender(<Table columns={nameColumn} dataSource={people()} />)
      expect(rowKeys(container)).toEqual([ada, grace, edsger])

      // A key follows its row, not its position.
      rerender(
        <Table columns={nameColumn} dataSource={[...people()].reverse()} />
      )
      expect(rowKeys(container)).toEqual([edsger, grace, ada])

      // Property order does not change the hash.
      rerender(
        <Table
          columns={nameColumn}
          dataSource={people().map(({ note, email, name }) => ({
            note,
            email,
            name,
          }))}
        />
      )
      expect(rowKeys(container)).toEqual([ada, grace, edsger])
    })

    it('gives identical records unique keys', () => {
      const { container } = render(
        <Table
          columns={nameColumn}
          dataSource={[{ name: 'Ada' }, { name: 'Ada' }, { name: 'Ada' }]}
        />
      )
      const [first, ...rest] = rowKeys(container)
      expect(first).toMatch(HASH_KEY)
      expect(rest).toEqual([`${first}~1`, `${first}~2`])
    })

    it('does not throw on records JSON cannot serialise', () => {
      const circular: Record<string, unknown> = { name: 'Ada', big: 1n }
      circular.self = circular
      circular.onClick = () => {}
      circular.missing = undefined
      const { container } = render(
        <Table columns={nameColumn} dataSource={[circular]} />
      )
      expect(rowKeys(container)).toEqual([expect.stringMatching(HASH_KEY)])
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

    it('selects the right record on a later page', () => {
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
      const firstPage = rowKeys(container)

      fireEvent.click(getByTitle('2'))
      const secondPage = rowKeys(container)
      expect(secondPage).toHaveLength(2)
      expect(secondPage).not.toContain(firstPage[0])
      expect(secondPage).not.toContain(firstPage[1])

      const row = container.querySelector<HTMLElement>(
        `tbody tr[data-row-key="${secondPage[0]}"]`
      )!
      fireEvent.click(within(row).getByRole('checkbox'))
      expect(onChange).toHaveBeenLastCalledWith(
        [secondPage[0]],
        [data[2]],
        expect.anything()
      )
    })

    it('keys nested rows, keeping identical children in different parents apart', () => {
      const { container } = render(
        <Table
          columns={nameColumn}
          dataSource={[
            { name: 'Parent', children: [{ name: 'Child' }] },
            { name: 'Other', children: [{ name: 'Child' }] },
          ]}
          expandable={{ defaultExpandAllRows: true }}
        />
      )
      const keys = rowKeys(container)
      expect(keys).toHaveLength(4)
      for (const key of keys) expect(key).toMatch(HASH_KEY)
      expect(new Set(keys).size).toBe(4)
      expect(keys[3]).toBe(`${keys[1]}~1`)
    })
  })
})
