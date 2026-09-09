import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
          errors: [],
        }}
      />
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  it('propagates validation on mount when only the errors changed', () => {
    // Operator and values are unchanged, but `maxValues` was lowered since
    // the rule was saved. The parent holds `errors: []`, and computes form
    // validity from that — so it has to hear about the new error.
    const onChange = vi.fn<(filter: FormFilter) => void>()
    render(
      <FilterInput
        filterConfigs={[{ ...configs[0], maxValues: 1 }]}
        onChange={onChange}
        value={{
          field: 'code',
          type: 'text',
          operator: 'isAnyOf',
          values: ['alpha', 'beta'],
          errors: [],
        }}
      />
    )
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toMatchObject({
      operator: 'isAnyOf',
      values: ['alpha', 'beta'],
      errors: ['Up to 1 values'],
    })
  })

  it('fills in errors for a restored filter that arrives without them', () => {
    // A plain `FilterForm` from storage has no `errors`; the form treats a
    // missing list as invalid, so a valid restored rule would disable Apply.
    const onChange = vi.fn<(filter: FormFilter) => void>()
    const persisted: FormFilter = {
      field: 'code',
      type: 'text',
      operator: 'contains',
      values: ['x'],
    }
    render(
      <FilterInput
        filterConfigs={configs}
        onChange={onChange}
        value={persisted}
      />
    )
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toMatchObject({
      operator: 'contains',
      values: ['x'],
      errors: [],
    })
    // The caller's object is left alone.
    expect(persisted.errors).toBeUndefined()
  })

  it('keeps a value typed without a separator when the input blurs', async () => {
    // The tags Select commits the pending text as a chip during its blur,
    // calling onChange then onBlur in the same event. onBlur must report the
    // filter *with* that chip, or a new rule finalizes without it.
    const onBlur = vi.fn<(filter: FormFilter) => void>()
    render(
      <FilterInput
        filterConfigs={configs}
        onBlur={onBlur}
        value={{
          field: 'code',
          type: 'text',
          operator: 'isAnyOf',
          values: ['alpha'],
          errors: [],
        }}
      />
    )
    const input = screen.getByRole('combobox', { name: 'Values' })
    fireEvent.change(input, { target: { value: 'beta' } })
    fireEvent.blur(input)

    await waitFor(() => expect(onBlur).toHaveBeenCalled())
    const last = onBlur.mock.calls[onBlur.mock.calls.length - 1][0]
    expect(last.values).toEqual(['alpha', 'beta'])
    expect(last.errors).toEqual([])
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
