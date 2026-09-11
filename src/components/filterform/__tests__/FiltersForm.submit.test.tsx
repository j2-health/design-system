import { vi } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { FiltersForm } from '../FiltersForm'
import { FilterConfig, FilterForm } from '../types'

// Unlike FiltersForm.test.tsx these run the real useFiltersForm: they cover
// the interaction between the inputs' deferred blur and Apply, which a mocked
// hook cannot exercise.

const configs: FilterConfig[] = [
  { field: 'name', type: 'text', label: 'Name' },
  {
    field: 'code',
    type: 'text',
    label: 'Code',
    operators: ['contains', 'isAnyOf', 'isNoneOf'],
    maxValues: 3,
  },
]

const option = (label: string) =>
  screen.findByText(label, { selector: '.ant-select-item-option-content' })

describe('FiltersForm submit with a rule still in the new-rule input', () => {
  it('submits a typed text rule when Apply is clicked straight away', async () => {
    // Regression: Apply read `filterGroups` only, and the new rule joins them
    // on a deferred blur — a fast Apply submitted `{ filters: [] }`.
    const user = userEvent.setup()
    const onSubmit = vi.fn<(values: FilterForm) => void>()
    render(<FiltersForm filterConfigs={configs} onSubmit={onSubmit} />)

    await user.type(screen.getByRole('textbox'), 'smith')
    await user.click(screen.getByRole('button', { name: 'Apply Filters' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0].filters).toEqual([
      expect.objectContaining({
        field: 'name',
        operator: 'contains',
        values: ['smith'],
      }),
    ])
  })

  it('submits a multi-value rule with its chips when Apply is clicked straight away', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn<(values: FilterForm) => void>()
    render(<FiltersForm filterConfigs={configs} onSubmit={onSubmit} />)

    const combos = () => screen.getAllByRole('combobox')
    await user.click(combos()[0])
    await user.click(await option('Code'))
    await user.click(combos()[1])
    await user.click(await option('is any of'))
    const chips = await screen.findByRole('combobox', { name: 'Values' })
    await user.click(chips)
    await user.paste('alpha, beta')
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByText('beta')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'Apply Filters' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0].filters).toEqual([
      expect.objectContaining({
        field: 'code',
        operator: 'isAnyOf',
        values: ['alpha', 'beta'],
      }),
    ])
  })

  it('does not submit the same rule twice once its blur has committed it', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn<(values: FilterForm) => void>()
    render(<FiltersForm filterConfigs={configs} onSubmit={onSubmit} />)

    await user.type(screen.getByRole('textbox'), 'smith')
    // Blur elsewhere and let the deferred commit land.
    await user.click(screen.getByText('Add Rule'))
    await new Promise((resolve) => setTimeout(resolve, 20))

    await user.click(screen.getByRole('button', { name: 'Apply Filters' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0].filters).toHaveLength(1)
    expect(onSubmit.mock.calls[0][0].filters[0]).toEqual(
      expect.objectContaining({ field: 'name', values: ['smith'] })
    )
  })

  it('does not submit an incomplete new rule', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn<(values: FilterForm) => void>()
    render(<FiltersForm filterConfigs={configs} onSubmit={onSubmit} />)

    // Nothing typed: the form is empty, Apply is allowed, and submits nothing.
    await user.click(screen.getByRole('button', { name: 'Apply Filters' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    expect(onSubmit.mock.calls[0][0]).toEqual({ filters: [] })
  })
})
