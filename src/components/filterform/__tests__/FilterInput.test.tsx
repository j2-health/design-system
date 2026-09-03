import { render, screen } from '@testing-library/react'
import { FilterInput, normalizeMultiValues } from '../FilterInput'
import { FilterConfig } from '../types'

const configs: FilterConfig[] = [
  {
    field: 'npi',
    label: 'NPI',
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
          field: 'npi',
          type: 'text',
          operator: 'isAnyOf',
          values: ['1234567890', '0987654321'],
        }}
      />
    )
    expect(screen.getByText('1234567890')).toBeInTheDocument()
    expect(screen.getByText('0987654321')).toBeInTheDocument()
    expect(screen.getByText('2 / 3 values')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('flags a list over the cap with a clear message', () => {
    render(
      <FilterInput
        filterConfigs={configs}
        value={{
          field: 'npi',
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

  it('keeps a single text box for the default text operators', () => {
    render(
      <FilterInput
        filterConfigs={configs}
        value={{
          field: 'npi',
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
