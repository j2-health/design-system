import { useCallback, useMemo } from 'react'

const explicitKey = (record: unknown) => {
  const { key, id } = (record ?? {}) as { key?: unknown; id?: unknown }
  for (const value of [key, id]) {
    if (typeof value === 'string') return value
    if (typeof value === 'number' && Number.isFinite(value)) return value
  }
}

// JSON with object keys sorted at every level, so property order does not
// matter. Circular references, functions and `undefined` are dropped rather
// than thrown on; bigints are written as strings.
const serialize = (record: unknown) => {
  const seen = new WeakSet<object>()
  return JSON.stringify(record, (_, value: unknown) => {
    if (typeof value === 'bigint') return String(value)
    if (!value || typeof value !== 'object') return value
    if (seen.has(value)) return undefined
    seen.add(value)
    if (Array.isArray(value)) return value
    const entries = Object.entries(value).sort(([a], [b]) => (a < b ? -1 : 1))
    return Object.fromEntries(entries)
  })
}

// FNV-1a: a small, fast, non-cryptographic 32-bit string hash.
const hashKey = (record: unknown) => {
  const text = serialize(record) ?? ''
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash = Math.imul(hash ^ text.charCodeAt(i), 0x01000193)
  }
  return `r-${(hash >>> 0).toString(36)}`
}

/**
 * The `rowKey` the Table uses when the caller passes none: `record.key`, then
 * `record.id`, then a hash of the record's contents (`r-…`). Rows whose hashes
 * match, identical records included, get `~1`, `~2`, … in `dataSource` order,
 * nested rows included. antd writes the key into the DOM as `data-row-key`, so
 * only the hash reaches the page, never the record's contents.
 */
export const useDefaultRowKey = <T>(
  dataSource: readonly T[] | undefined,
  childrenColumnName: string
) => {
  const keys = useMemo(() => {
    const keys = new Map<unknown, string>()
    const counts = new Map<string, number>()
    const walk = (rows: readonly unknown[]) =>
      rows.forEach((row) => {
        if (explicitKey(row) === undefined && !keys.has(row)) {
          const hash = hashKey(row)
          const n = counts.get(hash) ?? 0
          counts.set(hash, n + 1)
          keys.set(row, n ? `${hash}~${n}` : hash)
        }
        const children = (row as Record<string, unknown>)?.[childrenColumnName]
        if (Array.isArray(children)) walk(children)
      })
    walk(dataSource ?? [])
    return keys
  }, [dataSource, childrenColumnName])

  return useCallback(
    (record: T) => explicitKey(record) ?? keys.get(record) ?? hashKey(record),
    [keys]
  )
}
