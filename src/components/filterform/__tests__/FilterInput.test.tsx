import { render, screen, fireEvent } from '@testing-library/react'
import { FilterInput } from '../FilterInput'
import { normalizeMultiValues } from '../filterHelpers'
import { FilterConfig, FormFilter } from '../types'

const configs: FilterConfig[] = [
  {
    field: 'code',
    label: 'Code',
    type: 'text',
    operators: ['contains', 'isAnyOf'],
    maxValues: 3,
  },
]

describe('normalizeMultiValues', () => {
  it('trims, drops empties and dedupes case-insensitively, keeping first-seen casing and order', () => {
    expect(
      normalizeMultiValues([
        ' Boston ',
        '',
        null,
        undefined,
        'boston',
        'Austin',
        'AUSTIN ',
        42,
      ])
    ).toEqual(['Boston', 'Austin', '42'])
    expect(normalizeMultiValues(undefined)).toEqual([])
  })
})

describe('FilterInput multi-value text operators', () => {
  it('renders one chip per value and a counter against the cap', () => {
    render(
      <FilterInput
        filterConfigs={configs}
        value={{
          field: 'code',
          type: 'text',
          operator: 'isAnyOf',
          values: ['alpha', 'beta'],
        }}
      />
    )
    expect(screen.getByText('alpha')).toBeInTheDocument()
    expect(screen.getByText('beta')).toBeInTheDocument()
    expect(screen.getByText('2 / 3 values')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('flags a list over the cap with a clear message', () => {
    render(
      <FilterInput
        filterConfigs={configs}
        value={{
          field: 'code',
          type: 'text',
          operator: 'isAnyOf',
          values: ['1', '2', '3', '4'],
        }}
      />
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Up to 3 values — remove 1 to apply'
    )
  })

  it('turns typed separated text into one chip per token', () => {
    // The tokenizer is antd's `tokenSeparators` wiring, not our helper —
    // exercise the real input so a regression in that wiring is caught.
    const onChange = vi.fn<(filter: FormFilter) => void>()
    render(
      <FilterInput
        filterConfigs={configs}
        onChange={onChange}
        value={{ field: 'code', type: 'text', operator: 'isAnyOf', values: [] }}
      />
    )
    fireEvent.change(screen.getByRole('combobox', { name: 'Values' }), {
      target: { value: 'alpha, beta\tALPHA,' },
    })

    const last = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0]
    expect(last?.operator).toBe('isAnyOf')
    expect(last?.values).toEqual(['alpha', 'beta'])
    expect(last?.errors).toEqual([])
    expect(screen.getByText('2 / 3 values')).toBeInTheDocument()
  })

  it('splits a pasted multi-line list (an Excel column) on the newlines', () => {
    // An <input> drops line breaks from a paste, so rc-select keeps the
    // clipboard text and restores the newlines before tokenizing. Fire the
    // paste first, then the change with the newline-stripped value the
    // browser would produce.
    const onChange = vi.fn<(filter: FormFilter) => void>()
    render(
      <FilterInput
        filterConfigs={configs}
        onChange={onChange}
        value={{ field: 'code', type: 'text', operator: 'isAnyOf', values: [] }}
      />
    )
    const input = screen.getByRole('combobox', { name: 'Values' })
    const clipboard = 'alpha\nbeta\r\ngamma'
    fireEvent.paste(input, {
      clipboardData: { getData: () => clipboard },
    })
    fireEvent.change(input, {
      target: {
        value: clipboard.replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' '),
      },
    })

    const last = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0]
    expect(last?.values).toEqual(['alpha', 'beta', 'gamma'])
    expect(screen.getByText('3 / 3 values')).toBeInTheDocument()
  })

  it('reports a corrected persisted filter to the parent on mount', () => {
    // Without this the form would hold (and submit) the stale operator until
    // the user touched the rule, since onChange is otherwise skipped on mount.
    const onChange = vi.fn<(filter: FormFilter) => void>()
    render(
      <FilterInput
        filterConfigs={[{ field: 'code', label: 'Code', type: 'text' }]}
        onChange={onChange}
        value={{
          field: 'code',
          type: 'text',
          operator: 'isAnyOf',
          values: ['a', 'b'],
        }}
      />
    )
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toMatchObject({
      operator: 'contains',
      values: [],
      errors: ['Value is required'],
    })
  })

  it('stays quiet on mount when the persisted filter needs no correction', () => {
    const onChange = vi.fn<(filter: FormFilter) => void>()
    render(
      <FilterInput
        filterConfigs={configs}
        onChange={onChange}
        value={{
          field: 'code',
          type: 'text',
          operator: 'isAnyOf',
          values: ['alpha', 'beta'],
        }}
      />
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  it('keeps a single text box for the default text operators', () => {
    render(
      <FilterInput
        filterConfigs={configs}
        value={{
          field: 'code',
          type: 'text',
          operator: 'contains',
          values: ['12'],
        }}
      />
    )
    expect(screen.getByRole('textbox')).toHaveValue('12')
    expect(screen.queryByText(/values$/)).not.toBeInTheDocument()
  })
})
