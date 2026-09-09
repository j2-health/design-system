import { act, renderHook } from '@testing-library/react'
import {
  isMultiValueTextOperator,
  operatorOptionsFor,
  TypeToOperatorOptions,
  useFilterField,
} from '../useFilterField'
import { FilterConfig, FormFilter } from '../types'

const text: FilterConfig = { field: 'code', label: 'Code', type: 'text' }
const multi: FilterConfig = {
  ...text,
  operators: ['contains', 'isAnyOf', 'isNoneOf'],
  maxValues: 3,
}

describe('operatorOptionsFor', () => {
  it('returns the type default list when no operators are declared', () => {
    // The multi-value operators are opt-in: a consumer that never sets
    // `operators` must see exactly the list it saw before they existed.
    expect(operatorOptionsFor(text)).toBe(TypeToOperatorOptions.text)
    expect(operatorOptionsFor(text).map((o) => o.value)).not.toContain(
      'isAnyOf'
    )
    expect(operatorOptionsFor({ field: 'n', label: 'N', type: 'number' })).toBe(
      TypeToOperatorOptions.number
    )
    expect(operatorOptionsFor({ field: 's', label: 'S', type: 'select' })).toBe(
      TypeToOperatorOptions.select
    )
  })

  it('surfaces the opt-in multi-value operators with labels, in declared order', () => {
    expect(operatorOptionsFor(multi)).toEqual([
      { label: 'contains', value: 'contains' },
      { label: 'is any of', value: 'isAnyOf' },
      { label: 'is not any of', value: 'isNoneOf' },
    ])
  })

  it('ignores operators the type cannot express', () => {
    expect(
      operatorOptionsFor({
        field: 'n',
        label: 'N',
        type: 'number',
        operators: ['isAnyOf', 'greaterThan'],
      })
    ).toEqual([{ label: 'is greater than', value: 'greaterThan' }])
    expect(
      operatorOptionsFor({
        field: 's',
        label: 'S',
        type: 'select',
        operators: ['isAnyOf'],
      })
    ).toEqual([])
  })
})

describe('isMultiValueTextOperator', () => {
  it('is true only for isAnyOf / isNoneOf', () => {
    expect(isMultiValueTextOperator('isAnyOf')).toBe(true)
    expect(isMultiValueTextOperator('isNoneOf')).toBe(true)
    expect(isMultiValueTextOperator('contains')).toBe(false)
    expect(isMultiValueTextOperator('equals')).toBe(false)
    expect(isMultiValueTextOperator(undefined)).toBe(false)
  })
})

describe('useFilterField with multi-value text operators', () => {
  it('offers the declared operators and switches to a chips input on isAnyOf', () => {
    const { result } = renderHook(() =>
      useFilterField({ filterConfigs: [multi] })
    )
    expect(result.current.operatorOptions.map((o) => o.value)).toEqual([
      'contains',
      'isAnyOf',
      'isNoneOf',
    ])
    expect(result.current.valueInputConfig).toEqual({
      type: 'text',
      multiValue: false,
      maxValues: 3,
    })

    act(() => result.current.handleOperatorChange('isAnyOf'))

    expect(result.current.filter?.operator).toBe('isAnyOf')
    expect(result.current.valueInputConfig).toEqual({
      type: 'text',
      multiValue: true,
      maxValues: 3,
    })
    // An empty chip list is not a filter.
    expect(result.current.filter?.errors).toEqual(['Value is required'])
  })

  it('accepts a chip list and flags one over maxValues', () => {
    const { result } = renderHook(() =>
      useFilterField({
        filterConfigs: [multi],
        filter: {
          field: 'code',
          type: 'text',
          operator: 'isAnyOf',
          values: [],
        },
      })
    )

    act(() => result.current.handleValuesChange(['1', '2', '3']))
    expect(result.current.filter?.values).toEqual(['1', '2', '3'])
    expect(result.current.filter?.errors).toEqual([])

    act(() => result.current.handleValuesChange(['1', '2', '3', '4']))
    expect(result.current.filter?.errors).toEqual(['Up to 3 values'])
  })

  it('keeps the plain text input for the default operators', () => {
    const { result } = renderHook(() =>
      useFilterField({ filterConfigs: [text] })
    )
    expect(result.current.filter?.operator).toBe('contains')
    expect(result.current.valueInputConfig).toEqual({
      type: 'text',
      multiValue: false,
      maxValues: undefined,
    })
  })

  it('normalizes chips as they enter state, so display, validation and submit agree', () => {
    // Review finding: normalizing only the rendered chips let `['ABC','abc']`
    // show one chip and "1 / 1 values" while validation counted two.
    const capped: FilterConfig = { ...multi, maxValues: 1 }
    const { result } = renderHook(() =>
      useFilterField({
        filterConfigs: [capped],
        filter: {
          field: 'code',
          type: 'text',
          operator: 'isAnyOf',
          values: [],
        },
      })
    )

    act(() => result.current.handleValuesChange(['ABC', ' abc ', '', null]))

    expect(result.current.filter?.values).toEqual(['ABC'])
    expect(result.current.filter?.errors).toEqual([])
  })

  it('normalizes a persisted chip list on initialize', () => {
    const { result } = renderHook(() =>
      useFilterField({
        filterConfigs: [{ ...multi, maxValues: 1 }],
        filter: {
          field: 'code',
          type: 'text',
          operator: 'isNoneOf',
          values: ['ABC', 'abc'],
        },
      })
    )
    expect(result.current.filter?.values).toEqual(['ABC'])
    expect(result.current.filter?.errors).toEqual([])
  })

  it('falls back when a persisted operator is not one the field offers', () => {
    // Review finding: the persisted operator always won, so a config narrowed
    // to `contains` could reopen and re-submit `endsWith`, and a field that
    // never opted in could reopen `isAnyOf`.
    const narrowed: FilterConfig = { ...text, operators: ['contains'] }
    const stale: FormFilter = {
      field: 'code',
      type: 'text',
      operator: 'endsWith',
      values: ['x'],
    }
    const { result } = renderHook(() =>
      useFilterField({ filterConfigs: [narrowed], filter: stale })
    )
    expect(result.current.filter?.operator).toBe('contains')
    expect(result.current.filter?.values).toEqual([])
    expect(result.current.filter?.errors).toEqual(['Value is required'])
    expect(result.current.valueInputConfig).toEqual({
      type: 'text',
      multiValue: false,
      maxValues: undefined,
    })
  })

  it('does not offer a persisted isAnyOf on a field that never opted in', () => {
    const { result } = renderHook(() =>
      useFilterField({
        filterConfigs: [text],
        filter: {
          field: 'code',
          type: 'text',
          operator: 'isAnyOf',
          values: ['a', 'b'],
        },
      })
    )
    expect(result.current.filter?.operator).toBe('contains')
    expect(result.current.filter?.values).toEqual([])
    expect(result.current.operatorOptions.map((o) => o.value)).not.toContain(
      'isAnyOf'
    )
  })

  it('keeps a persisted operator that the field still offers', () => {
    const { result } = renderHook(() =>
      useFilterField({
        filterConfigs: [text],
        filter: {
          field: 'code',
          type: 'text',
          operator: 'endsWith',
          values: ['x'],
        },
      })
    )
    expect(result.current.filter?.operator).toBe('endsWith')
    expect(result.current.filter?.values).toEqual(['x'])
  })

  it('re-opens a persisted isAnyOf filter with its chips intact', () => {
    const { result } = renderHook(() =>
      useFilterField({
        filterConfigs: [multi],
        filter: {
          field: 'code',
          type: 'text',
          operator: 'isNoneOf',
          values: ['1', '2'],
        },
      })
    )
    expect(result.current.filter?.values).toEqual(['1', '2'])
    expect(result.current.filter?.errors).toEqual([])
    expect(result.current.valueInputConfig).toEqual({
      type: 'text',
      multiValue: true,
      maxValues: 3,
    })
  })
})
