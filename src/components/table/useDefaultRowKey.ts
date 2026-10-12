import { useCallback, useMemo, useRef } from 'react'

type RowKey = string | number

const isRowKey = (value: unknown): value is RowKey =>
  typeof value === 'string' ||
  (typeof value === 'number' && Number.isFinite(value))

// `process.env.NODE_ENV` is left as written in the library build, so the
// consuming app's bundler replaces it. The try covers a runtime that has no
// `process` at all, where we stay quiet.
const isDevelopment = () => {
  try {
    return process.env.NODE_ENV !== 'production'
  } catch {
    return false
  }
}

// Objects that are not in `dataSource` (antd should never ask for one) still
// get a key that is unique and says nothing about their contents.
const identityKeys = new WeakMap<object, string>()
let nextIdentityKey = 0
const identityKey = (record: object) => {
  let key = identityKeys.get(record)
  if (key === undefined) {
    key = `row-ref-${nextIdentityKey++}`
    identityKeys.set(record, key)
  }
  return key
}

/**
 * The `rowKey` the Table uses when the caller passes none.
 *
 * antd writes a row's key into the DOM as `data-row-key`, so the key must not
 * carry the record's contents: anything that records DOM attributes (session
 * replay, error reporting, browser extensions) would capture fields that no
 * column displays.
 *
 * In order of preference:
 * 1. `record.key`, which is antd's own default;
 * 2. `record.id`;
 * 3. the record's position in `dataSource` (`row-0`, nested rows `row-0-1`),
 *    with a one-time development warning.
 *
 * The position comes from `dataSource` itself rather than from the index antd
 * passes, because antd's index is unreliable: it is relative to the current
 * page in the body but to the full data in row selection, and some calls omit
 * it. A key taken from `dataSource` is the same on every page, survives
 * client-side sorting, and stays put across re-renders that recreate the
 * record objects in the same order.
 */
export const useDefaultRowKey = <T>(
  dataSource: readonly T[] | undefined,
  childrenColumnName: string
): ((record: T) => RowKey) => {
  const { positions, explicitKeys } = useMemo(() => {
    const isRecord = (row: unknown): row is Record<string, unknown> =>
      !!row && typeof row === 'object'
    const explicitKeyOf = (row: Record<string, unknown>) =>
      isRowKey(row.key) ? row.key : isRowKey(row.id) ? row.id : undefined

    // Every `key`/`id` already in use. React compares keys as strings, so
    // `1` and `'1'` are the same key.
    const explicitKeys = new Set<string>()
    const collect = (rows: readonly unknown[]) => {
      rows.forEach((row) => {
        if (!isRecord(row)) return
        const key = explicitKeyOf(row)
        if (key !== undefined) explicitKeys.add(String(key))
        const children = row[childrenColumnName]
        if (Array.isArray(children)) collect(children)
      })
    }
    collect(dataSource ?? [])

    // A generated key must not equal a record's own key, or two rows would
    // share one: `[{ name: 'A' }, { key: 'row-0' }]` would give both `row-0`.
    const unused = (candidate: string) => {
      let key = candidate
      for (let n = 1; explicitKeys.has(key); n++) key = `${candidate}~${n}`
      return key
    }

    const positions = new WeakMap<object, string>()
    const walk = (rows: readonly unknown[], prefix: string) => {
      rows.forEach((row, index) => {
        if (!isRecord(row)) return
        const position = prefix ? `${prefix}-${index}` : `row-${index}`
        if (!positions.has(row) && explicitKeyOf(row) === undefined) {
          positions.set(row, unused(position))
        }
        const children = row[childrenColumnName]
        if (Array.isArray(children)) walk(children, position)
      })
    }
    walk(dataSource ?? [], '')
    return { positions, explicitKeys }
  }, [dataSource, childrenColumnName])

  const warned = useRef(false)

  return useCallback(
    (record: T) => {
      if (record && typeof record === 'object') {
        const { key, id } = record as { key?: unknown; id?: unknown }
        if (isRowKey(key)) return key
        if (isRowKey(id)) return id
      }

      if (!warned.current && isDevelopment()) {
        warned.current = true
        console.warn(
          'Table: records have no `key` or `id`, so rows are keyed by their ' +
            'position in `dataSource`. Pass `rowKey` to key them by a unique ' +
            'field instead.'
        )
      }

      if (record && typeof record === 'object') {
        const position = positions.get(record)
        if (position !== undefined) return position
        let key = identityKey(record)
        while (explicitKeys.has(key)) key = identityKey({})
        return key
      }
      return 'row-unknown'
    },
    [positions, explicitKeys]
  )
}
