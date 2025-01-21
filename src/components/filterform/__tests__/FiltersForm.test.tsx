import { userEvent } from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'
import { FiltersForm } from '../FiltersForm'
import { FilterConfig, FilterForm } from '../types'
import '@testing-library/jest-dom'
import { useFiltersForm } from '../useFiltersForm'

jest.mock('../useFiltersForm', () => ({
  useFiltersForm: jest.fn(),
}))

describe('FiltersForm', () => {
  const filterConfigs: FilterConfig[] = [
    { field: 'name', type: 'text', label: 'Name' },
  ]

  const mockHook = (output: Partial<ReturnType<typeof useFiltersForm>>) => {
    ;(useFiltersForm as jest.Mock).mockImplementation(() => ({
      dispatch: jest.fn(),
      filterGroups: [
        {
          field: 'name',
          filters: [
            {
              field: 'name',
              operator: 'contains',
              type: 'text',
              values: ['test'],
              errors: [],
            },
          ],
        },
      ],
      isNewFilterInputOpen: false,
      isValid: true,
      ...output,
    }))
  }

  it('should enable submit button when form is empty and return empty filters on submit', async () => {
    mockHook({
      filterGroups: [
        {
          field: 'name',
          filters: [
            {
              field: 'name',
              operator: 'contains',
              type: 'text',
              values: [],
              errors: [],
            },
          ],
        },
      ],
    })
    let submittedValues: FilterForm | undefined
    const onSubmit = (values: FilterForm) => {
      submittedValues = values
    }

    render(<FiltersForm onSubmit={onSubmit} filterConfigs={filterConfigs} />)
    await userEvent.click(screen.getByRole('button', { name: 'Apply Filters' }))
    expect(submittedValues).toEqual({ filters: [] })
  })

  it('should disable the submit button when rules are not valid', async () => {
    mockHook({
      isValid: false,
    })

    act(() => {
      render(<FiltersForm onSubmit={jest.fn()} filterConfigs={filterConfigs} />)
    })

    expect(screen.getByRole('button', { name: 'Apply Filters' })).toBeDisabled()
  })

  it('should disable the add rule button when rules are not valid', async () => {
    mockHook({
      isNewFilterInputOpen: false,
      isValid: false,
    })
    render(<FiltersForm onSubmit={jest.fn()} filterConfigs={filterConfigs} />)
    expect(screen.getByRole('button', { name: 'Add Rule' })).toBeDisabled()
  })

  it('should enable the add rule button when rules are valid', async () => {
    mockHook({
      isNewFilterInputOpen: false,
      isValid: true,
    })
    act(() => {
      render(
        <FiltersForm
          onSubmit={jest.fn()}
          filterConfigs={filterConfigs}
          initialValues={{
            filters: [
              {
                field: 'name',
                operator: 'contains',
                type: 'text',
                values: ['test'],
              },
            ],
          }}
        />
      )
    })

    expect(screen.getByRole('button', { name: 'Add Rule' })).toBeEnabled()
  })
})
