import { userEvent } from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { FiltersForm } from '../FiltersForm'
import { FilterConfig, FilterForm } from '../types'
import '@testing-library/jest-dom'
describe('FiltersForm', () => {
  const filterConfigs: FilterConfig[] = [
    { field: 'name', type: 'text', label: 'Name' },
  ]

  it('should enable submit button when form is empty and return empty filters on submit', async () => {
    let submittedValues: FilterForm | undefined
    const onSubmit = (values: FilterForm) => {
      submittedValues = values
    }
    render(<FiltersForm onSubmit={onSubmit} filterConfigs={filterConfigs} />)
    await userEvent.click(screen.getByRole('button', { name: 'Apply Filters' }))
    expect(submittedValues).toEqual({ filters: [] })
  })

  it('should disable the submit button when rules are not valid and the form is not empty', async () => {
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
    await userEvent.click(screen.getByRole('button', { name: 'Add Rule' }))

    await waitFor(
      () => {
        expect(
          screen.getByRole('button', { name: 'Apply Filters' })
        ).toBeDisabled()
      },
      { timeout: 1000 }
    )
  })

  it('should disable the add rule button when rules are not valid', async () => {
    render(<FiltersForm onSubmit={jest.fn()} filterConfigs={filterConfigs} />)
    expect(screen.getByRole('button', { name: 'Add Rule' })).toBeDisabled()
  })

  it('should enable the add rule button when rules are valid', async () => {
    render(<FiltersForm onSubmit={jest.fn()} filterConfigs={filterConfigs} />)

    await userEvent.type(screen.getByRole('textbox'), 'test')

    expect(screen.getByRole('button', { name: 'Add Rule' })).toBeEnabled()
  })
})
