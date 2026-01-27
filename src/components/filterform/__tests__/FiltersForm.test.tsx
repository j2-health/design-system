import { vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { act, render, screen } from '@testing-library/react'
import { FiltersForm } from '../FiltersForm'
import { FilterConfig, FilterForm } from '../types'
import '@testing-library/jest-dom'
import { useFiltersForm } from '../useFiltersForm'

vi.mock('../useFiltersForm', () => ({
  useFiltersForm: vi.fn(),
}))

describe('FiltersForm', () => {
  const filterConfigs: FilterConfig[] = [
    { field: 'name', type: 'text', label: 'Name' },
  ]

  const mockHook = (output: Partial<ReturnType<typeof useFiltersForm>>) => {
    ;(useFiltersForm as ReturnType<typeof vi.fn>).mockImplementation(() => ({
      dispatch: vi.fn(),
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
      isEmpty: false,
      ...output,
    }))
  }

  describe('submit button', () => {
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
        isEmpty: true,
      })
      let submittedValues: FilterForm | undefined
      const onSubmit = (values: FilterForm) => {
        submittedValues = values
      }

      render(<FiltersForm onSubmit={onSubmit} filterConfigs={filterConfigs} />)
      await userEvent.click(
        screen.getByRole('button', { name: 'Apply Filters' })
      )
      expect(submittedValues).toEqual({ filters: [] })
    })

    it('should enable the submit button when the form is empty', async () => {
      mockHook({
        isEmpty: true,
      })

      render(<FiltersForm onSubmit={vi.fn()} filterConfigs={filterConfigs} />)
      expect(
        screen.getByRole('button', { name: 'Apply Filters' })
      ).toBeEnabled()
    })

    it('should disable the submit button when the form is not empty and rules are not valid', async () => {
      mockHook({
        isValid: false,
        isEmpty: false,
      })

      act(() => {
        render(<FiltersForm onSubmit={vi.fn()} filterConfigs={filterConfigs} />)
      })

      expect(
        screen.getByRole('button', { name: 'Apply Filters' })
      ).toBeDisabled()
    })

    it('should enable the submit button when the form is not empty and rules are valid', async () => {
      mockHook({
        isValid: true,
        isEmpty: false,
      })
      render(<FiltersForm onSubmit={vi.fn()} filterConfigs={filterConfigs} />)
      expect(
        screen.getByRole('button', { name: 'Apply Filters' })
      ).toBeEnabled()
    })
  })

  describe('add rule button', () => {
    it('should disable the add rule button when rules are not valid', async () => {
      mockHook({
        isValid: false,
      })
      render(<FiltersForm onSubmit={vi.fn()} filterConfigs={filterConfigs} />)
      expect(screen.getByRole('button', { name: 'Add Rule' })).toBeDisabled()
    })

    it('should enable the add rule button when rules are valid', async () => {
      mockHook({
        isValid: true,
      })
      act(() => {
        render(<FiltersForm onSubmit={vi.fn()} filterConfigs={filterConfigs} />)
      })

      expect(screen.getByRole('button', { name: 'Add Rule' })).toBeEnabled()
    })
  })
})
